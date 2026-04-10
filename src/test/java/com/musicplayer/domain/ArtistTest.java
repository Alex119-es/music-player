package com.musicplayer.domain;

import static com.musicplayer.domain.ArtistTestSamples.*;
import static com.musicplayer.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ArtistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Artist.class);
        Artist artist1 = getArtistSample1();
        Artist artist2 = new Artist();
        assertThat(artist1).isNotEqualTo(artist2);

        artist2.setId(artist1.getId());
        assertThat(artist1).isEqualTo(artist2);

        artist2 = getArtistSample2();
        assertThat(artist1).isNotEqualTo(artist2);
    }

    @Test
    void songsTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        artist.addSongs(songBack);
        assertThat(artist.getSongses()).containsOnly(songBack);
        assertThat(songBack.getArtistses()).containsOnly(artist);

        artist.removeSongs(songBack);
        assertThat(artist.getSongses()).doesNotContain(songBack);
        assertThat(songBack.getArtistses()).doesNotContain(artist);

        artist.songses(new HashSet<>(Set.of(songBack)));
        assertThat(artist.getSongses()).containsOnly(songBack);
        assertThat(songBack.getArtistses()).containsOnly(artist);

        artist.setSongses(new HashSet<>());
        assertThat(artist.getSongses()).doesNotContain(songBack);
        assertThat(songBack.getArtistses()).doesNotContain(artist);
    }
}
