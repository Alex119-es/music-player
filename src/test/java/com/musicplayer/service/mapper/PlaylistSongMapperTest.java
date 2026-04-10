package com.musicplayer.service.mapper;

import static com.musicplayer.domain.PlaylistSongAsserts.*;
import static com.musicplayer.domain.PlaylistSongTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlaylistSongMapperTest {

    private PlaylistSongMapper playlistSongMapper;

    @BeforeEach
    void setUp() {
        playlistSongMapper = new PlaylistSongMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPlaylistSongSample1();
        var actual = playlistSongMapper.toEntity(playlistSongMapper.toDto(expected));
        assertPlaylistSongAllPropertiesEquals(expected, actual);
    }
}
