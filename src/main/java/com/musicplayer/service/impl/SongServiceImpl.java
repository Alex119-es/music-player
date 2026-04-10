package com.musicplayer.service.impl;

import com.musicplayer.domain.Song;
import com.musicplayer.repository.SongRepository;
import com.musicplayer.service.SongService;
import com.musicplayer.service.dto.SongDTO;
import com.musicplayer.service.mapper.SongMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.Song}.
 */
@Service
@Transactional
public class SongServiceImpl implements SongService {

    private static final Logger LOG = LoggerFactory.getLogger(SongServiceImpl.class);

    private final SongRepository songRepository;

    private final SongMapper songMapper;

    public SongServiceImpl(SongRepository songRepository, SongMapper songMapper) {
        this.songRepository = songRepository;
        this.songMapper = songMapper;
    }

    @Override
    public SongDTO save(SongDTO songDTO) {
        LOG.debug("Request to save Song : {}", songDTO);
        Song song = songMapper.toEntity(songDTO);
        song = songRepository.save(song);
        return songMapper.toDto(song);
    }

    @Override
    public SongDTO update(SongDTO songDTO) {
        LOG.debug("Request to update Song : {}", songDTO);
        Song song = songMapper.toEntity(songDTO);
        song = songRepository.save(song);
        return songMapper.toDto(song);
    }

    @Override
    public Optional<SongDTO> partialUpdate(SongDTO songDTO) {
        LOG.debug("Request to partially update Song : {}", songDTO);

        return songRepository
            .findById(songDTO.getId())
            .map(existingSong -> {
                songMapper.partialUpdate(existingSong, songDTO);

                return existingSong;
            })
            .map(songRepository::save)
            .map(songMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SongDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Songs");
        return songRepository.findAll(pageable).map(songMapper::toDto);
    }

    public Page<SongDTO> findAllWithEagerRelationships(Pageable pageable) {
        return songRepository.findAllWithEagerRelationships(pageable).map(songMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SongDTO> findOne(Long id) {
        LOG.debug("Request to get Song : {}", id);
        return songRepository.findOneWithEagerRelationships(id).map(songMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Song : {}", id);
        songRepository.deleteById(id);
    }
}
