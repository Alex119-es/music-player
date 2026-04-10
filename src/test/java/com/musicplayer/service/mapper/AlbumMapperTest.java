package com.musicplayer.service.mapper;

import static com.musicplayer.domain.AlbumAsserts.*;
import static com.musicplayer.domain.AlbumTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AlbumMapperTest {

    private AlbumMapper albumMapper;

    @BeforeEach
    void setUp() {
        albumMapper = new AlbumMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAlbumSample1();
        var actual = albumMapper.toEntity(albumMapper.toDto(expected));
        assertAlbumAllPropertiesEquals(expected, actual);
    }
}
