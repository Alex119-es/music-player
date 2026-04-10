package com.musicplayer.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlaylistSongDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlaylistSongDTO.class);
        PlaylistSongDTO playlistSongDTO1 = new PlaylistSongDTO();
        playlistSongDTO1.setId(1L);
        PlaylistSongDTO playlistSongDTO2 = new PlaylistSongDTO();
        assertThat(playlistSongDTO1).isNotEqualTo(playlistSongDTO2);
        playlistSongDTO2.setId(playlistSongDTO1.getId());
        assertThat(playlistSongDTO1).isEqualTo(playlistSongDTO2);
        playlistSongDTO2.setId(2L);
        assertThat(playlistSongDTO1).isNotEqualTo(playlistSongDTO2);
        playlistSongDTO1.setId(null);
        assertThat(playlistSongDTO1).isNotEqualTo(playlistSongDTO2);
    }
}
