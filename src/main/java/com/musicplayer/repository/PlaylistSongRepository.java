package com.musicplayer.repository;

import com.musicplayer.domain.PlaylistSong;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PlaylistSong entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {}
