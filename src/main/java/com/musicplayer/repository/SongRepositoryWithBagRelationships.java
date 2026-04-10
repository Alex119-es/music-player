package com.musicplayer.repository;

import com.musicplayer.domain.Song;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SongRepositoryWithBagRelationships {
    Optional<Song> fetchBagRelationships(Optional<Song> song);

    List<Song> fetchBagRelationships(List<Song> songs);

    Page<Song> fetchBagRelationships(Page<Song> songs);
}
