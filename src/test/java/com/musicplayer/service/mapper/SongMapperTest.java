package com.musicplayer.service.mapper;

import static com.musicplayer.domain.SongAsserts.*;
import static com.musicplayer.domain.SongTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SongMapperTest {

    private SongMapper songMapper;

    @BeforeEach
    void setUp() {
        songMapper = new SongMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getSongSample1();
        var actual = songMapper.toEntity(songMapper.toDto(expected));
        assertSongAllPropertiesEquals(expected, actual);
    }
}
