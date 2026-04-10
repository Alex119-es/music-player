package com.musicplayer.domain;

import static com.musicplayer.domain.PlaylistSongTestSamples.*;
import static com.musicplayer.domain.PlaylistTestSamples.*;
import static com.musicplayer.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlaylistSongTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaylistSong.class);
        PlaylistSong playlistSong1 = getPlaylistSongSample1();
        PlaylistSong playlistSong2 = new PlaylistSong();
        assertThat(playlistSong1).isNotEqualTo(playlistSong2);

        playlistSong2.setId(playlistSong1.getId());
        assertThat(playlistSong1).isEqualTo(playlistSong2);

        playlistSong2 = getPlaylistSongSample2();
        assertThat(playlistSong1).isNotEqualTo(playlistSong2);
    }

    @Test
    void playlistTest() {
        PlaylistSong playlistSong = getPlaylistSongRandomSampleGenerator();
        Playlist playlistBack = getPlaylistRandomSampleGenerator();

        playlistSong.setPlaylist(playlistBack);
        assertThat(playlistSong.getPlaylist()).isEqualTo(playlistBack);

        playlistSong.playlist(null);
        assertThat(playlistSong.getPlaylist()).isNull();
    }

    @Test
    void songTest() {
        PlaylistSong playlistSong = getPlaylistSongRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        playlistSong.setSong(songBack);
        assertThat(playlistSong.getSong()).isEqualTo(songBack);

        playlistSong.song(null);
        assertThat(playlistSong.getSong()).isNull();
    }
}
