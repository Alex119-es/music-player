package com.musicplayer.web.rest;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class FileUploadResource {

    private static final Logger LOG = LoggerFactory.getLogger(FileUploadResource.class);

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // Validar tipo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten imágenes"));
            }

            // Crear directorio si no existe
            Path uploadPath = Path.of(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único
            String extension =
                file.getOriginalFilename() != null
                    ? file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."))
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Guardar fichero
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Devolver URL
            String url = "/uploads/" + filename;
            LOG.debug("Imagen guardada: {}", url);

            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            LOG.error("Error al guardar imagen", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al guardar la imagen"));
        }
    }
}
