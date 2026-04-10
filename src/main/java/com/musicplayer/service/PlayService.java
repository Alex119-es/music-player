package com.musicplayer.service;

import com.musicplayer.service.dto.PlayDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.musicplayer.domain.Play}.
 */
public interface PlayService {
    /**
     * Save a play.
     *
     * @param playDTO the entity to save.
     * @return the persisted entity.
     */
    PlayDTO save(PlayDTO playDTO);

    /**
     * Updates a play.
     *
     * @param playDTO the entity to update.
     * @return the persisted entity.
     */
    PlayDTO update(PlayDTO playDTO);

    /**
     * Partially updates a play.
     *
     * @param playDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<PlayDTO> partialUpdate(PlayDTO playDTO);

    /**
     * Get all the plays.
     *
     * @return the list of entities.
     */
    List<PlayDTO> findAll();

    /**
     * Get the "id" play.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PlayDTO> findOne(Long id);

    /**
     * Delete the "id" play.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
