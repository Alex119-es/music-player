package com.musicplayer.service.mapper;

import static com.musicplayer.domain.PlaylistAsserts.*;
import static com.musicplayer.domain.PlaylistTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlaylistMapperTest {

    private PlaylistMapper playlistMapper;

    @BeforeEach
    void setUp() {
        playlistMapper = new PlaylistMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPlaylistSample1();
        var actual = playlistMapper.toEntity(playlistMapper.toDto(expected));
        assertPlaylistAllPropertiesEquals(expected, actual);
    }
}
