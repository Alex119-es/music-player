package com.musicplayer.web.rest;

import com.musicplayer.repository.PlaylistSongRepository;
import com.musicplayer.service.PlaylistSongService;
import com.musicplayer.service.dto.PlaylistSongDTO;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.musicplayer.domain.PlaylistSong}.
 */
@RestController
@RequestMapping("/api/playlist-songs")
public class PlaylistSongResource {

    private static final Logger LOG = LoggerFactory.getLogger(PlaylistSongResource.class);

    private static final String ENTITY_NAME = "playlistSong";

    @Value("${jhipster.clientApp.name:musicPlayer}")
    private String applicationName;

    private final PlaylistSongService playlistSongService;

    private final PlaylistSongRepository playlistSongRepository;

    public PlaylistSongResource(PlaylistSongService playlistSongService, PlaylistSongRepository playlistSongRepository) {
        this.playlistSongService = playlistSongService;
        this.playlistSongRepository = playlistSongRepository;
    }

    /**
     * {@code POST  /playlist-songs} : Create a new playlistSong.
     *
     * @param playlistSongDTO the playlistSongDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new playlistSongDTO, or with status {@code 400 (Bad Request)} if the playlistSong has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<PlaylistSongDTO> createPlaylistSong(@Valid @RequestBody PlaylistSongDTO playlistSongDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save PlaylistSong : {}", playlistSongDTO);
        if (playlistSongDTO.getId() != null) {
            throw new BadRequestAlertException("A new playlistSong cannot already have an ID", ENTITY_NAME, "idexists");
        }
        playlistSongDTO = playlistSongService.save(playlistSongDTO);
        return ResponseEntity.created(new URI("/api/playlist-songs/" + playlistSongDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, playlistSongDTO.getId().toString()))
            .body(playlistSongDTO);
    }

    /**
     * {@code PUT  /playlist-songs/:id} : Updates an existing playlistSong.
     *
     * @param id the id of the playlistSongDTO to save.
     * @param playlistSongDTO the playlistSongDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playlistSongDTO,
     * or with status {@code 400 (Bad Request)} if the playlistSongDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the playlistSongDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlaylistSongDTO> updatePlaylistSong(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PlaylistSongDTO playlistSongDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update PlaylistSong : {}, {}", id, playlistSongDTO);
        if (playlistSongDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playlistSongDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playlistSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        playlistSongDTO = playlistSongService.update(playlistSongDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, playlistSongDTO.getId().toString()))
            .body(playlistSongDTO);
    }

    /**
     * {@code PATCH  /playlist-songs/:id} : Partial updates given fields of an existing playlistSong, field will ignore if it is null
     *
     * @param id the id of the playlistSongDTO to save.
     * @param playlistSongDTO the playlistSongDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated playlistSongDTO,
     * or with status {@code 400 (Bad Request)} if the playlistSongDTO is not valid,
     * or with status {@code 404 (Not Found)} if the playlistSongDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the playlistSongDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PlaylistSongDTO> partialUpdatePlaylistSong(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PlaylistSongDTO playlistSongDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update PlaylistSong partially : {}, {}", id, playlistSongDTO);
        if (playlistSongDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, playlistSongDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!playlistSongRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PlaylistSongDTO> result = playlistSongService.partialUpdate(playlistSongDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, playlistSongDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /playlist-songs} : get all the Playlist Songs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Playlist Songs in body.
     */
    @GetMapping("")
    public List<PlaylistSongDTO> getAllPlaylistSongs() {
        LOG.debug("REST request to get all PlaylistSongs");
        return playlistSongService.findAll();
    }

    /**
     * {@code GET  /playlist-songs/:id} : get the "id" playlistSong.
     *
     * @param id the id of the playlistSongDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the playlistSongDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlaylistSongDTO> getPlaylistSong(@PathVariable("id") Long id) {
        LOG.debug("REST request to get PlaylistSong : {}", id);
        Optional<PlaylistSongDTO> playlistSongDTO = playlistSongService.findOne(id);
        return ResponseUtil.wrapOrNotFound(playlistSongDTO);
    }

    /**
     * {@code DELETE  /playlist-songs/:id} : delete the "id" playlistSong.
     *
     * @param id the id of the playlistSongDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylistSong(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete PlaylistSong : {}", id);
        playlistSongService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
