package com.musicplayer.domain;

import static com.musicplayer.domain.AlbumTestSamples.*;
import static com.musicplayer.domain.ArtistTestSamples.*;
import static com.musicplayer.domain.GenreTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AlbumTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Album.class);
        Album album1 = getAlbumSample1();
        Album album2 = new Album();
        assertThat(album1).isNotEqualTo(album2);

        album2.setId(album1.getId());
        assertThat(album1).isEqualTo(album2);

        album2 = getAlbumSample2();
        assertThat(album1).isNotEqualTo(album2);
    }

    @Test
    void artistTest() {
        Album album = getAlbumRandomSampleGenerator();
        Artist artistBack = getArtistRandomSampleGenerator();

        album.setArtist(artistBack);
        assertThat(album.getArtist()).isEqualTo(artistBack);

        album.artist(null);
        assertThat(album.getArtist()).isNull();
    }

    @Test
    void genreTest() {
        Album album = getAlbumRandomSampleGenerator();
        Genre genreBack = getGenreRandomSampleGenerator();

        album.setGenre(genreBack);
        assertThat(album.getGenre()).isEqualTo(genreBack);

        album.genre(null);
        assertThat(album.getGenre()).isNull();
    }
}
