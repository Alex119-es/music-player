package com.musicplayer.service.impl;

import com.musicplayer.domain.Like;
import com.musicplayer.repository.LikeRepository;
import com.musicplayer.service.LikeService;
import com.musicplayer.service.dto.LikeDTO;
import com.musicplayer.service.mapper.LikeMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.Like}.
 */
@Service
@Transactional
public class LikeServiceImpl implements LikeService {

    private static final Logger LOG = LoggerFactory.getLogger(LikeServiceImpl.class);

    private final LikeRepository likeRepository;

    private final LikeMapper likeMapper;

    public LikeServiceImpl(LikeRepository likeRepository, LikeMapper likeMapper) {
        this.likeRepository = likeRepository;
        this.likeMapper = likeMapper;
    }

    @Override
    public LikeDTO save(LikeDTO likeDTO) {
        LOG.debug("Request to save Like : {}", likeDTO);
        Like like = likeMapper.toEntity(likeDTO);
        like = likeRepository.save(like);
        return likeMapper.toDto(like);
    }

    @Override
    public LikeDTO update(LikeDTO likeDTO) {
        LOG.debug("Request to update Like : {}", likeDTO);
        Like like = likeMapper.toEntity(likeDTO);
        like = likeRepository.save(like);
        return likeMapper.toDto(like);
    }

    @Override
    public Optional<LikeDTO> partialUpdate(LikeDTO likeDTO) {
        LOG.debug("Request to partially update Like : {}", likeDTO);

        return likeRepository
            .findById(likeDTO.getId())
            .map(existingLike -> {
                likeMapper.partialUpdate(existingLike, likeDTO);

                return existingLike;
            })
            .map(likeRepository::save)
            .map(likeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LikeDTO> findAll() {
        LOG.debug("Request to get all Likes");
        return likeRepository.findAll().stream().map(likeMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LikeDTO> findOne(Long id) {
        LOG.debug("Request to get Like : {}", id);
        return likeRepository.findById(id).map(likeMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Like : {}", id);
        likeRepository.deleteById(id);
    }
}
