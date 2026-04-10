package com.musicplayer.service.mapper;

import com.musicplayer.domain.Like;
import com.musicplayer.domain.Song;
import com.musicplayer.domain.User;
import com.musicplayer.service.dto.LikeDTO;
import com.musicplayer.service.dto.SongDTO;
import com.musicplayer.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Like} and its DTO {@link LikeDTO}.
 */
@Mapper(componentModel = "spring")
public interface LikeMapper extends EntityMapper<LikeDTO, Like> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "song", source = "song", qualifiedByName = "songId")
    LikeDTO toDto(Like s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("songId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SongDTO toDtoSongId(Song song);
}
