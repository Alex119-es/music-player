package com.musicplayer.repository;

import com.musicplayer.domain.Play;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Play entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PlayRepository extends JpaRepository<Play, Long> {
    @Query("select play from Play play where play.user.login = ?#{authentication.name}")
    List<Play> findByUserIsCurrentUser();
}
