package com.musicplayer.repository;

import com.musicplayer.domain.Song;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class SongRepositoryWithBagRelationshipsImpl implements SongRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String SONGS_PARAMETER = "songs";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Song> fetchBagRelationships(Optional<Song> song) {
        return song.map(this::fetchArtistses);
    }

    @Override
    public Page<Song> fetchBagRelationships(Page<Song> songs) {
        return new PageImpl<>(fetchBagRelationships(songs.getContent()), songs.getPageable(), songs.getTotalElements());
    }

    @Override
    public List<Song> fetchBagRelationships(List<Song> songs) {
        return Optional.of(songs).map(this::fetchArtistses).orElse(Collections.emptyList());
    }

    Song fetchArtistses(Song result) {
        return entityManager
            .createQuery("select song from Song song left join fetch song.artistses where song.id = :id", Song.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Song> fetchArtistses(List<Song> songs) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, songs.size()).forEach(index -> order.put(songs.get(index).getId(), index));
        List<Song> result = entityManager
            .createQuery("select song from Song song left join fetch song.artistses where song in :songs", Song.class)
            .setParameter(SONGS_PARAMETER, songs)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
