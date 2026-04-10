package com.musicplayer.service.mapper;

import static com.musicplayer.domain.PlayAsserts.*;
import static com.musicplayer.domain.PlayTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PlayMapperTest {

    private PlayMapper playMapper;

    @BeforeEach
    void setUp() {
        playMapper = new PlayMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPlaySample1();
        var actual = playMapper.toEntity(playMapper.toDto(expected));
        assertPlayAllPropertiesEquals(expected, actual);
    }
}
