package com.musicplayer.repository;

import com.musicplayer.domain.Album;
import java.time.LocalDate;
import java.util.List;
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

    @Query(
        """
            SELECT a FROM Album a
            WHERE a.active = true
            AND (a.releaseDate IS NULL OR a.releaseDate <= :today)
        """
    )
    Page<Album> findPublicAlbums(@Param("today") LocalDate today, Pageable pageable);

    @Query(
        """
            SELECT a FROM Album a
            WHERE a.active = true
            AND a.releaseDate IS NOT NULL
            AND a.releaseDate > :today
            ORDER BY a.releaseDate ASC
        """
    )
    List<Album> findUpcomingAlbums(@Param("today") LocalDate today);

    List<Album> findByArtistUserLoginAndActiveTrueAndReleaseDateAfter(String login, LocalDate date);
}
