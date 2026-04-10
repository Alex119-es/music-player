package com.musicplayer.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlayDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PlayDTO.class);
        PlayDTO playDTO1 = new PlayDTO();
        playDTO1.setId(1L);
        PlayDTO playDTO2 = new PlayDTO();
        assertThat(playDTO1).isNotEqualTo(playDTO2);
        playDTO2.setId(playDTO1.getId());
        assertThat(playDTO1).isEqualTo(playDTO2);
        playDTO2.setId(2L);
        assertThat(playDTO1).isNotEqualTo(playDTO2);
        playDTO1.setId(null);
        assertThat(playDTO1).isNotEqualTo(playDTO2);
    }
}
