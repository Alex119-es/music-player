package com.musicplayer.web.rest;

import static com.musicplayer.domain.ArtistAsserts.*;
import static com.musicplayer.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.IntegrationTest;
import com.musicplayer.domain.Artist;
import com.musicplayer.repository.ArtistRepository;
import com.musicplayer.service.dto.ArtistDTO;
import com.musicplayer.service.mapper.ArtistMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ArtistResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArtistResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_BIO = "AAAAAAAAAA";
    private static final String UPDATED_BIO = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AA";
    private static final String UPDATED_COUNTRY = "BB";

    private static final Boolean DEFAULT_VERIFIED = false;
    private static final Boolean UPDATED_VERIFIED = true;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/artists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private ArtistMapper artistMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArtistMockMvc;

    private Artist artist;

    private Artist insertedArtist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artist createEntity() {
        return new Artist()
            .name(DEFAULT_NAME)
            .bio(DEFAULT_BIO)
            .image(DEFAULT_IMAGE)
            .country(DEFAULT_COUNTRY)
            .verified(DEFAULT_VERIFIED)
            .createdAt(DEFAULT_CREATED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Artist createUpdatedEntity() {
        return new Artist()
            .name(UPDATED_NAME)
            .bio(UPDATED_BIO)
            .image(UPDATED_IMAGE)
            .country(UPDATED_COUNTRY)
            .verified(UPDATED_VERIFIED)
            .createdAt(UPDATED_CREATED_AT);
    }

    @BeforeEach
    void initTest() {
        artist = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedArtist != null) {
            artistRepository.delete(insertedArtist);
            insertedArtist = null;
        }
    }

    @Test
    @Transactional
    void createArtist() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);
        var returnedArtistDTO = om.readValue(
            restArtistMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ArtistDTO.class
        );

        // Validate the Artist in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedArtist = artistMapper.toEntity(returnedArtistDTO);
        assertArtistUpdatableFieldsEquals(returnedArtist, getPersistedArtist(returnedArtist));

        insertedArtist = returnedArtist;
    }

    @Test
    @Transactional
    void createArtistWithExistingId() throws Exception {
        // Create the Artist with an existing ID
        artist.setId(1L);
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArtistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        artist.setName(null);

        // Create the Artist, which fails.
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        restArtistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllArtists() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        // Get all the artistList
        restArtistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(artist.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].bio").value(hasItem(DEFAULT_BIO)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)))
            .andExpect(jsonPath("$.[*].verified").value(hasItem(DEFAULT_VERIFIED)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())));
    }

    @Test
    @Transactional
    void getArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        // Get the artist
        restArtistMockMvc
            .perform(get(ENTITY_API_URL_ID, artist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(artist.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.bio").value(DEFAULT_BIO))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY))
            .andExpect(jsonPath("$.verified").value(DEFAULT_VERIFIED))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingArtist() throws Exception {
        // Get the artist
        restArtistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist
        Artist updatedArtist = artistRepository.findById(artist.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedArtist are not directly saved in db
        em.detach(updatedArtist);
        updatedArtist
            .name(UPDATED_NAME)
            .bio(UPDATED_BIO)
            .image(UPDATED_IMAGE)
            .country(UPDATED_COUNTRY)
            .verified(UPDATED_VERIFIED)
            .createdAt(UPDATED_CREATED_AT);
        ArtistDTO artistDTO = artistMapper.toDto(updatedArtist);

        restArtistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, artistDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedArtistToMatchAllProperties(updatedArtist);
    }

    @Test
    @Transactional
    void putNonExistingArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, artistDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(artistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(artistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArtistWithPatch() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist using partial update
        Artist partialUpdatedArtist = new Artist();
        partialUpdatedArtist.setId(artist.getId());

        partialUpdatedArtist.verified(UPDATED_VERIFIED);

        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedArtist))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertArtistUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedArtist, artist), getPersistedArtist(artist));
    }

    @Test
    @Transactional
    void fullUpdateArtistWithPatch() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the artist using partial update
        Artist partialUpdatedArtist = new Artist();
        partialUpdatedArtist.setId(artist.getId());

        partialUpdatedArtist
            .name(UPDATED_NAME)
            .bio(UPDATED_BIO)
            .image(UPDATED_IMAGE)
            .country(UPDATED_COUNTRY)
            .verified(UPDATED_VERIFIED)
            .createdAt(UPDATED_CREATED_AT);

        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArtist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedArtist))
            )
            .andExpect(status().isOk());

        // Validate the Artist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertArtistUpdatableFieldsEquals(partialUpdatedArtist, getPersistedArtist(partialUpdatedArtist));
    }

    @Test
    @Transactional
    void patchNonExistingArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, artistDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(artistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(artistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArtist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        artist.setId(longCount.incrementAndGet());

        // Create the Artist
        ArtistDTO artistDTO = artistMapper.toDto(artist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArtistMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(artistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Artist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArtist() throws Exception {
        // Initialize the database
        insertedArtist = artistRepository.saveAndFlush(artist);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the artist
        restArtistMockMvc
            .perform(delete(ENTITY_API_URL_ID, artist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return artistRepository.count();
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

    protected Artist getPersistedArtist(Artist artist) {
        return artistRepository.findById(artist.getId()).orElseThrow();
    }

    protected void assertPersistedArtistToMatchAllProperties(Artist expectedArtist) {
        assertArtistAllPropertiesEquals(expectedArtist, getPersistedArtist(expectedArtist));
    }

    protected void assertPersistedArtistToMatchUpdatableProperties(Artist expectedArtist) {
        assertArtistAllUpdatablePropertiesEquals(expectedArtist, getPersistedArtist(expectedArtist));
    }
}
