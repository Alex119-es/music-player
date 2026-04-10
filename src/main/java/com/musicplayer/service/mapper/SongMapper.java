package com.musicplayer.service.mapper;

import com.musicplayer.domain.Album;
import com.musicplayer.domain.Artist;
import com.musicplayer.domain.Genre;
import com.musicplayer.domain.Song;
import com.musicplayer.service.dto.AlbumDTO;
import com.musicplayer.service.dto.ArtistDTO;
import com.musicplayer.service.dto.GenreDTO;
import com.musicplayer.service.dto.SongDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Song} and its DTO {@link SongDTO}.
 */
@Mapper(componentModel = "spring")
public interface SongMapper extends EntityMapper<SongDTO, Song> {
    @Mapping(target = "album", source = "album", qualifiedByName = "albumId")
    @Mapping(target = "genre", source = "genre", qualifiedByName = "genreId")
    @Mapping(target = "artistses", source = "artistses", qualifiedByName = "artistIdSet")
    SongDTO toDto(Song s);

    @Mapping(target = "removeArtists", ignore = true)
    Song toEntity(SongDTO songDTO);

    @Named("albumId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AlbumDTO toDtoAlbumId(Album album);

    @Named("genreId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    GenreDTO toDtoGenreId(Genre genre);

    @Named("artistId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ArtistDTO toDtoArtistId(Artist artist);

    @Named("artistIdSet")
    default Set<ArtistDTO> toDtoArtistIdSet(Set<Artist> artist) {
        return artist.stream().map(this::toDtoArtistId).collect(Collectors.toSet());
    }
}
