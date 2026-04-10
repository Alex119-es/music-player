package com.musicplayer.domain;

import static com.musicplayer.domain.PlayTestSamples.*;
import static com.musicplayer.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlayTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Play.class);
        Play play1 = getPlaySample1();
        Play play2 = new Play();
        assertThat(play1).isNotEqualTo(play2);

        play2.setId(play1.getId());
        assertThat(play1).isEqualTo(play2);

        play2 = getPlaySample2();
        assertThat(play1).isNotEqualTo(play2);
    }

    @Test
    void songTest() {
        Play play = getPlayRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        play.setSong(songBack);
        assertThat(play.getSong()).isEqualTo(songBack);

        play.song(null);
        assertThat(play.getSong()).isNull();
    }
}
