package com.musicplayer.domain;

import static com.musicplayer.domain.AlbumTestSamples.*;
import static com.musicplayer.domain.ArtistTestSamples.*;
import static com.musicplayer.domain.GenreTestSamples.*;
import static com.musicplayer.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SongTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Song.class);
        Song song1 = getSongSample1();
        Song song2 = new Song();
        assertThat(song1).isNotEqualTo(song2);

        song2.setId(song1.getId());
        assertThat(song1).isEqualTo(song2);

        song2 = getSongSample2();
        assertThat(song1).isNotEqualTo(song2);
    }

    @Test
    void albumTest() {
        Song song = getSongRandomSampleGenerator();
        Album albumBack = getAlbumRandomSampleGenerator();

        song.setAlbum(albumBack);
        assertThat(song.getAlbum()).isEqualTo(albumBack);

        song.album(null);
        assertThat(song.getAlbum()).isNull();
    }

    @Test
    void genreTest() {
        Song song = getSongRandomSampleGenerator();
        Genre genreBack = getGenreRandomSampleGenerator();

        song.setGenre(genreBack);
        assertThat(song.getGenre()).isEqualTo(genreBack);

        song.genre(null);
        assertThat(song.getGenre()).isNull();
    }

    @Test
    void artistsTest() {
        Song song = getSongRandomSampleGenerator();
        Artist artistBack = getArtistRandomSampleGenerator();

        song.addArtists(artistBack);
        assertThat(song.getArtistses()).containsOnly(artistBack);

        song.removeArtists(artistBack);
        assertThat(song.getArtistses()).doesNotContain(artistBack);

        song.artistses(new HashSet<>(Set.of(artistBack)));
        assertThat(song.getArtistses()).containsOnly(artistBack);

        song.setArtistses(new HashSet<>());
        assertThat(song.getArtistses()).doesNotContain(artistBack);
    }
}
