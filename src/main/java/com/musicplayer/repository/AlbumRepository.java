package com.musicplayer.repository;

import com.musicplayer.domain.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Album entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query("SELECT a FROM Album a WHERE a.artist.user.login = :login")
    Page<Album> findAllByArtistUserLogin(@Param("login") String login, Pageable pageable);
}
