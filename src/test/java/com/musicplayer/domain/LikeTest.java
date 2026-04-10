package com.musicplayer.domain;

import static com.musicplayer.domain.LikeTestSamples.*;
import static com.musicplayer.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LikeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Like.class);
        Like like1 = getLikeSample1();
        Like like2 = new Like();
        assertThat(like1).isNotEqualTo(like2);

        like2.setId(like1.getId());
        assertThat(like1).isEqualTo(like2);

        like2 = getLikeSample2();
        assertThat(like1).isNotEqualTo(like2);
    }

    @Test
    void songTest() {
        Like like = getLikeRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        like.setSong(songBack);
        assertThat(like.getSong()).isEqualTo(songBack);

        like.song(null);
        assertThat(like.getSong()).isNull();
    }
}
