package com.musicplayer.service.impl;

import com.musicplayer.domain.Play;
import com.musicplayer.repository.PlayRepository;
import com.musicplayer.service.PlayService;
import com.musicplayer.service.dto.PlayDTO;
import com.musicplayer.service.mapper.PlayMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.Play}.
 */
@Service
@Transactional
public class PlayServiceImpl implements PlayService {

    private static final Logger LOG = LoggerFactory.getLogger(PlayServiceImpl.class);

    private final PlayRepository playRepository;

    private final PlayMapper playMapper;

    public PlayServiceImpl(PlayRepository playRepository, PlayMapper playMapper) {
        this.playRepository = playRepository;
        this.playMapper = playMapper;
    }

    @Override
    public PlayDTO save(PlayDTO playDTO) {
        LOG.debug("Request to save Play : {}", playDTO);
        Play play = playMapper.toEntity(playDTO);
        play = playRepository.save(play);
        return playMapper.toDto(play);
    }

    @Override
    public PlayDTO update(PlayDTO playDTO) {
        LOG.debug("Request to update Play : {}", playDTO);
        Play play = playMapper.toEntity(playDTO);
        play = playRepository.save(play);
        return playMapper.toDto(play);
    }

    @Override
    public Optional<PlayDTO> partialUpdate(PlayDTO playDTO) {
        LOG.debug("Request to partially update Play : {}", playDTO);

        return playRepository
            .findById(playDTO.getId())
            .map(existingPlay -> {
                playMapper.partialUpdate(existingPlay, playDTO);

                return existingPlay;
            })
            .map(playRepository::save)
            .map(playMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlayDTO> findAll() {
        LOG.debug("Request to get all Plays");
        return playRepository.findAll().stream().map(playMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PlayDTO> findOne(Long id) {
        LOG.debug("Request to get Play : {}", id);
        return playRepository.findById(id).map(playMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Play : {}", id);
        playRepository.deleteById(id);
    }
}
