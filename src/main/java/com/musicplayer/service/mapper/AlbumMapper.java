package com.musicplayer.service.mapper;

import com.musicplayer.domain.Album;
import com.musicplayer.domain.Artist;
import com.musicplayer.domain.Genre;
import com.musicplayer.service.dto.AlbumDTO;
import com.musicplayer.service.dto.ArtistDTO;
import com.musicplayer.service.dto.GenreDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Album} and its DTO {@link AlbumDTO}.
 */
@Mapper(componentModel = "spring")
public interface AlbumMapper extends EntityMapper<AlbumDTO, Album> {
    @Mapping(target = "artist", source = "artist", qualifiedByName = "artistId")
    @Mapping(target = "genre", source = "genre", qualifiedByName = "genreId")
    AlbumDTO toDto(Album s);

    @Named("artistId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ArtistDTO toDtoArtistId(Artist artist);

    @Named("genreId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GenreDTO toDtoGenreId(Genre genre);
}
