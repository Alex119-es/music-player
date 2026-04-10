package com.musicplayer.service.mapper;

import static com.musicplayer.domain.ArtistAsserts.*;
import static com.musicplayer.domain.ArtistTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ArtistMapperTest {

    private ArtistMapper artistMapper;

    @BeforeEach
    void setUp() {
        artistMapper = new ArtistMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getArtistSample1();
        var actual = artistMapper.toEntity(artistMapper.toDto(expected));
        assertArtistAllPropertiesEquals(expected, actual);
    }
}
