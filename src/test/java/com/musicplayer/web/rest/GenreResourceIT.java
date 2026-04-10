package com.musicplayer.web.rest;

import static com.musicplayer.domain.GenreAsserts.*;
import static com.musicplayer.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.IntegrationTest;
import com.musicplayer.domain.Genre;
import com.musicplayer.repository.GenreRepository;
import com.musicplayer.service.dto.GenreDTO;
import com.musicplayer.service.mapper.GenreMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GenreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GenreResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/genres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private GenreMapper genreMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGenreMockMvc;

    private Genre genre;

    private Genre insertedGenre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Genre createEntity() {
        return new Genre().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Genre createUpdatedEntity() {
        return new Genre().name(UPDATED_NAME);
    }

    @BeforeEach
    void initTest() {
        genre = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedGenre != null) {
            genreRepository.delete(insertedGenre);
            insertedGenre = null;
        }
    }

    @Test
    @Transactional
    void createGenre() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);
        var returnedGenreDTO = om.readValue(
            restGenreMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            GenreDTO.class
        );

        // Validate the Genre in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedGenre = genreMapper.toEntity(returnedGenreDTO);
        assertGenreUpdatableFieldsEquals(returnedGenre, getPersistedGenre(returnedGenre));

        insertedGenre = returnedGenre;
    }

    @Test
    @Transactional
    void createGenreWithExistingId() throws Exception {
        // Create the Genre with an existing ID
        genre.setId(1L);
        GenreDTO genreDTO = genreMapper.toDto(genre);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGenreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        genre.setName(null);

        // Create the Genre, which fails.
        GenreDTO genreDTO = genreMapper.toDto(genre);

        restGenreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGenres() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        // Get all the genreList
        restGenreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(genre.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getGenre() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        // Get the genre
        restGenreMockMvc
            .perform(get(ENTITY_API_URL_ID, genre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(genre.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingGenre() throws Exception {
        // Get the genre
        restGenreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGenre() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genre
        Genre updatedGenre = genreRepository.findById(genre.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGenre are not directly saved in db
        em.detach(updatedGenre);
        updatedGenre.name(UPDATED_NAME);
        GenreDTO genreDTO = genreMapper.toDto(updatedGenre);

        restGenreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, genreDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO))
            )
            .andExpect(status().isOk());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGenreToMatchAllProperties(updatedGenre);
    }

    @Test
    @Transactional
    void putNonExistingGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, genreDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(genreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(genreDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGenreWithPatch() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genre using partial update
        Genre partialUpdatedGenre = new Genre();
        partialUpdatedGenre.setId(genre.getId());

        partialUpdatedGenre.name(UPDATED_NAME);

        restGenreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenre.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGenre))
            )
            .andExpect(status().isOk());

        // Validate the Genre in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGenreUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedGenre, genre), getPersistedGenre(genre));
    }

    @Test
    @Transactional
    void fullUpdateGenreWithPatch() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the genre using partial update
        Genre partialUpdatedGenre = new Genre();
        partialUpdatedGenre.setId(genre.getId());

        partialUpdatedGenre.name(UPDATED_NAME);

        restGenreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGenre.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGenre))
            )
            .andExpect(status().isOk());

        // Validate the Genre in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGenreUpdatableFieldsEquals(partialUpdatedGenre, getPersistedGenre(partialUpdatedGenre));
    }

    @Test
    @Transactional
    void patchNonExistingGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, genreDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(genreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(genreDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGenre() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        genre.setId(longCount.incrementAndGet());

        // Create the Genre
        GenreDTO genreDTO = genreMapper.toDto(genre);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGenreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(genreDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Genre in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGenre() throws Exception {
        // Initialize the database
        insertedGenre = genreRepository.saveAndFlush(genre);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the genre
        restGenreMockMvc
            .perform(delete(ENTITY_API_URL_ID, genre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return genreRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Genre getPersistedGenre(Genre genre) {
        return genreRepository.findById(genre.getId()).orElseThrow();
    }

    protected void assertPersistedGenreToMatchAllProperties(Genre expectedGenre) {
        assertGenreAllPropertiesEquals(expectedGenre, getPersistedGenre(expectedGenre));
    }

    protected void assertPersistedGenreToMatchUpdatableProperties(Genre expectedGenre) {
        assertGenreAllUpdatablePropertiesEquals(expectedGenre, getPersistedGenre(expectedGenre));
    }
}
