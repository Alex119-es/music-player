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
        WHERE a.active = false
        AND a.artist.user.login = :login
        ORDER BY a.id DESC
        """
    )
    List<Album> findUpcomingAlbums(@Param("login") String login);

    List<Album> findByArtistUserLoginAndActiveTrueAndReleaseDateAfter(String login, LocalDate date);

    List<Album> findByActiveFalseAndReleaseDateLessThanEqual(LocalDate date);
}
