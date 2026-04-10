package com.musicplayer.service.impl;

import com.musicplayer.domain.Genre;
import com.musicplayer.repository.GenreRepository;
import com.musicplayer.service.GenreService;
import com.musicplayer.service.dto.GenreDTO;
import com.musicplayer.service.mapper.GenreMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.musicplayer.domain.Genre}.
 */
@Service
@Transactional
public class GenreServiceImpl implements GenreService {

    private static final Logger LOG = LoggerFactory.getLogger(GenreServiceImpl.class);

    private final GenreRepository genreRepository;

    private final GenreMapper genreMapper;

    public GenreServiceImpl(GenreRepository genreRepository, GenreMapper genreMapper) {
        this.genreRepository = genreRepository;
        this.genreMapper = genreMapper;
    }

    @Override
    public GenreDTO save(GenreDTO genreDTO) {
        LOG.debug("Request to save Genre : {}", genreDTO);
        Genre genre = genreMapper.toEntity(genreDTO);
        genre = genreRepository.save(genre);
        return genreMapper.toDto(genre);
    }

    @Override
    public GenreDTO update(GenreDTO genreDTO) {
        LOG.debug("Request to update Genre : {}", genreDTO);
        Genre genre = genreMapper.toEntity(genreDTO);
        genre = genreRepository.save(genre);
        return genreMapper.toDto(genre);
    }

    @Override
    public Optional<GenreDTO> partialUpdate(GenreDTO genreDTO) {
        LOG.debug("Request to partially update Genre : {}", genreDTO);

        return genreRepository
            .findById(genreDTO.getId())
            .map(existingGenre -> {
                genreMapper.partialUpdate(existingGenre, genreDTO);

                return existingGenre;
            })
            .map(genreRepository::save)
            .map(genreMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<GenreDTO> findAll() {
        LOG.debug("Request to get all Genres");
        return genreRepository.findAll().stream().map(genreMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<GenreDTO> findOne(Long id) {
        LOG.debug("Request to get Genre : {}", id);
        return genreRepository.findById(id).map(genreMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Genre : {}", id);
        genreRepository.deleteById(id);
    }
}
