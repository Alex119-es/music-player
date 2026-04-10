package com.musicplayer.service.impl;

import com.musicplayer.domain.Album;
import com.musicplayer.repository.AlbumRepository;
import com.musicplayer.service.AlbumService;
import com.musicplayer.service.dto.AlbumDTO;
import com.musicplayer.service.mapper.AlbumMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.Album}.
 */
@Service
@Transactional
public class AlbumServiceImpl implements AlbumService {

    private static final Logger LOG = LoggerFactory.getLogger(AlbumServiceImpl.class);

    private final AlbumRepository albumRepository;

    private final AlbumMapper albumMapper;

    public AlbumServiceImpl(AlbumRepository albumRepository, AlbumMapper albumMapper) {
        this.albumRepository = albumRepository;
        this.albumMapper = albumMapper;
    }

    @Override
    public AlbumDTO save(AlbumDTO albumDTO) {
        LOG.debug("Request to save Album : {}", albumDTO);
        Album album = albumMapper.toEntity(albumDTO);
        album = albumRepository.save(album);
        return albumMapper.toDto(album);
    }

    @Override
    public AlbumDTO update(AlbumDTO albumDTO) {
        LOG.debug("Request to update Album : {}", albumDTO);
        Album album = albumMapper.toEntity(albumDTO);
        album = albumRepository.save(album);
        return albumMapper.toDto(album);
    }

    @Override
    public Optional<AlbumDTO> partialUpdate(AlbumDTO albumDTO) {
        LOG.debug("Request to partially update Album : {}", albumDTO);

        return albumRepository
            .findById(albumDTO.getId())
            .map(existingAlbum -> {
                albumMapper.partialUpdate(existingAlbum, albumDTO);

                return existingAlbum;
            })
            .map(albumRepository::save)
            .map(albumMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AlbumDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Albums");
        return albumRepository.findAll(pageable).map(albumMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AlbumDTO> findOne(Long id) {
        LOG.debug("Request to get Album : {}", id);
        return albumRepository.findById(id).map(albumMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Album : {}", id);
        albumRepository.deleteById(id);
    }
}
