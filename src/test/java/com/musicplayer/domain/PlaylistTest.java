package com.musicplayer.domain;

import static com.musicplayer.domain.PlaylistTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.musicplayer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlaylistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Playlist.class);
        Playlist playlist1 = getPlaylistSample1();
        Playlist playlist2 = new Playlist();
        assertThat(playlist1).isNotEqualTo(playlist2);

        playlist2.setId(playlist1.getId());
        assertThat(playlist1).isEqualTo(playlist2);

        playlist2 = getPlaylistSample2();
        assertThat(playlist1).isNotEqualTo(playlist2);
    }
}
