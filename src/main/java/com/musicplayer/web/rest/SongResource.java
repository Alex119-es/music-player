package com.musicplayer.web.rest;

import com.musicplayer.repository.SongRepository;
import com.musicplayer.service.SongService;
import com.musicplayer.service.dto.SongDTO;
import com.musicplayer.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.musicplayer.domain.Song}.
 */
@RestController
@RequestMapping("/api/songs")
public class SongResource {

    private static final Logger LOG = LoggerFactory.getLogger(SongResource.class);

    private static final String ENTITY_NAME = "song";

    @Value("${jhipster.clientApp.name:musicPlayer}")
    private String applicationName;

    private final SongService songService;

    private final SongRepository songRepository;

    public SongResource(SongService songService, SongRepository songRepository) {
        this.songService = songService;
        this.songRepository = songRepository;
    }

    /**
     * {@code POST  /songs} : Create a new song.
     *
     * @param songDTO the songDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new songDTO, or with status {@code 400 (Bad Request)} if the song has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SongDTO> createSong(@Valid @RequestBody SongDTO songDTO) throws URISyntaxException {
        LOG.debug("REST request to save Song : {}", songDTO);
        if (songDTO.getId() != null) {
            throw new BadRequestAlertException("A new song cannot already have an ID", ENTITY_NAME, "idexists");
        }
        songDTO = songService.save(songDTO);
        return ResponseEntity.created(new URI("/api/songs/" + songDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, songDTO.getId().toString()))
            .body(songDTO);
    }

    /**
     * {@code PUT  /songs/:id} : Updates an existing song.
     *
     * @param id the id of the songDTO to save.
     * @param songDTO the songDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated songDTO,
     * or with status {@code 400 (Bad Request)} if the songDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the songDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SongDTO> updateSong(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SongDTO songDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Song : {}, {}", id, songDTO);
        if (songDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, songDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!songRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        songDTO = songService.update(songDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, songDTO.getId().toString()))
            .body(songDTO);
    }

    /**
     * {@code PATCH  /songs/:id} : Partial updates given fields of an existing song, field will ignore if it is null
     *
     * @param id the id of the songDTO to save.
     * @param songDTO the songDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated songDTO,
     * or with status {@code 400 (Bad Request)} if the songDTO is not valid,
     * or with status {@code 404 (Not Found)} if the songDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the songDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SongDTO> partialUpdateSong(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SongDTO songDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Song partially : {}, {}", id, songDTO);
        if (songDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, songDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!songRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SongDTO> result = songService.partialUpdate(songDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, songDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /songs} : get all the Songs.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Songs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<SongDTO>> getAllSongs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Songs");
        Page<SongDTO> page;
        if (eagerload) {
            page = songService.findAllWithEagerRelationships(pageable);
        } else {
            page = songService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /songs/:id} : get the "id" song.
     *
     * @param id the id of the songDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the songDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SongDTO> getSong(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Song : {}", id);
        Optional<SongDTO> songDTO = songService.findOne(id);
        return ResponseUtil.wrapOrNotFound(songDTO);
    }

    /**
     * {@code DELETE  /songs/:id} : delete the "id" song.
     *
     * @param id the id of the songDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Song : {}", id);
        songService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
