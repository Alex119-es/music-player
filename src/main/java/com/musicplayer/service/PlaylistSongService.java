package com.musicplayer.service;

import com.musicplayer.service.dto.PlaylistSongDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.musicplayer.domain.PlaylistSong}.
 */
public interface PlaylistSongService {
    /**
     * Save a playlistSong.
     *
     * @param playlistSongDTO the entity to save.
     * @return the persisted entity.
     */
    PlaylistSongDTO save(PlaylistSongDTO playlistSongDTO);

    /**
     * Updates a playlistSong.
     *
     * @param playlistSongDTO the entity to update.
     * @return the persisted entity.
     */
    PlaylistSongDTO update(PlaylistSongDTO playlistSongDTO);

    /**
     * Partially updates a playlistSong.
     *
     * @param playlistSongDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PlaylistSongDTO> partialUpdate(PlaylistSongDTO playlistSongDTO);

    /**
     * Get all the playlistSongs.
     *
     * @return the list of entities.
     */
    List<PlaylistSongDTO> findAll();

    /**
     * Get the "id" playlistSong.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PlaylistSongDTO> findOne(Long id);

    /**
     * Delete the "id" playlistSong.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
