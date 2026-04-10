package com.musicplayer.service.impl;

import com.musicplayer.domain.PlaylistSong;
import com.musicplayer.repository.PlaylistSongRepository;
import com.musicplayer.service.PlaylistSongService;
import com.musicplayer.service.dto.PlaylistSongDTO;
import com.musicplayer.service.mapper.PlaylistSongMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.PlaylistSong}.
 */
@Service
@Transactional
public class PlaylistSongServiceImpl implements PlaylistSongService {

    private static final Logger LOG = LoggerFactory.getLogger(PlaylistSongServiceImpl.class);

    private final PlaylistSongRepository playlistSongRepository;

    private final PlaylistSongMapper playlistSongMapper;

    public PlaylistSongServiceImpl(PlaylistSongRepository playlistSongRepository, PlaylistSongMapper playlistSongMapper) {
        this.playlistSongRepository = playlistSongRepository;
        this.playlistSongMapper = playlistSongMapper;
    }

    @Override
    public PlaylistSongDTO save(PlaylistSongDTO playlistSongDTO) {
        LOG.debug("Request to save PlaylistSong : {}", playlistSongDTO);
        PlaylistSong playlistSong = playlistSongMapper.toEntity(playlistSongDTO);
        playlistSong = playlistSongRepository.save(playlistSong);
        return playlistSongMapper.toDto(playlistSong);
    }

    @Override
    public PlaylistSongDTO update(PlaylistSongDTO playlistSongDTO) {
        LOG.debug("Request to update PlaylistSong : {}", playlistSongDTO);
        PlaylistSong playlistSong = playlistSongMapper.toEntity(playlistSongDTO);
        playlistSong = playlistSongRepository.save(playlistSong);
        return playlistSongMapper.toDto(playlistSong);
    }

    @Override
    public Optional<PlaylistSongDTO> partialUpdate(PlaylistSongDTO playlistSongDTO) {
        LOG.debug("Request to partially update PlaylistSong : {}", playlistSongDTO);

        return playlistSongRepository
            .findById(playlistSongDTO.getId())
            .map(existingPlaylistSong -> {
                playlistSongMapper.partialUpdate(existingPlaylistSong, playlistSongDTO);

                return existingPlaylistSong;
            })
            .map(playlistSongRepository::save)
            .map(playlistSongMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlaylistSongDTO> findAll() {
        LOG.debug("Request to get all PlaylistSongs");
        return playlistSongRepository.findAll().stream().map(playlistSongMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PlaylistSongDTO> findOne(Long id) {
        LOG.debug("Request to get PlaylistSong : {}", id);
        return playlistSongRepository.findById(id).map(playlistSongMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete PlaylistSong : {}", id);
        playlistSongRepository.deleteById(id);
    }
}
