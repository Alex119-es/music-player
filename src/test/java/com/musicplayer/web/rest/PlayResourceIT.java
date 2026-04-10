package com.musicplayer.web.rest;

import static com.musicplayer.domain.PlayAsserts.*;
import static com.musicplayer.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.IntegrationTest;
import com.musicplayer.domain.Play;
import com.musicplayer.repository.PlayRepository;
import com.musicplayer.repository.UserRepository;
import com.musicplayer.service.dto.PlayDTO;
import com.musicplayer.service.mapper.PlayMapper;
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
 * Integration tests for the {@link PlayResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlayResourceIT {

    private static final Instant DEFAULT_PLAYED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PLAYED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Integer DEFAULT_DURATION_LISTENED = 1;
    private static final Integer UPDATED_DURATION_LISTENED = 2;

    private static final String ENTITY_API_URL = "/api/plays";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlayRepository playRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayMapper playMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlayMockMvc;

    private Play play;

    private Play insertedPlay;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Play createEntity() {
        return new Play().playedAt(DEFAULT_PLAYED_AT).durationListened(DEFAULT_DURATION_LISTENED);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Play createUpdatedEntity() {
        return new Play().playedAt(UPDATED_PLAYED_AT).durationListened(UPDATED_DURATION_LISTENED);
    }

    @BeforeEach
    void initTest() {
        play = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedPlay != null) {
            playRepository.delete(insertedPlay);
            insertedPlay = null;
        }
    }

    @Test
    @Transactional
    void createPlay() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);
        var returnedPlayDTO = om.readValue(
            restPlayMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PlayDTO.class
        );

        // Validate the Play in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPlay = playMapper.toEntity(returnedPlayDTO);
        assertPlayUpdatableFieldsEquals(returnedPlay, getPersistedPlay(returnedPlay));

        insertedPlay = returnedPlay;
    }

    @Test
    @Transactional
    void createPlayWithExistingId() throws Exception {
        // Create the Play with an existing ID
        play.setId(1L);
        PlayDTO playDTO = playMapper.toDto(play);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlayMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlays() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        // Get all the playList
        restPlayMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(play.getId().intValue())))
            .andExpect(jsonPath("$.[*].playedAt").value(hasItem(DEFAULT_PLAYED_AT.toString())))
            .andExpect(jsonPath("$.[*].durationListened").value(hasItem(DEFAULT_DURATION_LISTENED)));
    }

    @Test
    @Transactional
    void getPlay() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        // Get the play
        restPlayMockMvc
            .perform(get(ENTITY_API_URL_ID, play.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(play.getId().intValue()))
            .andExpect(jsonPath("$.playedAt").value(DEFAULT_PLAYED_AT.toString()))
            .andExpect(jsonPath("$.durationListened").value(DEFAULT_DURATION_LISTENED));
    }

    @Test
    @Transactional
    void getNonExistingPlay() throws Exception {
        // Get the play
        restPlayMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlay() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the play
        Play updatedPlay = playRepository.findById(play.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlay are not directly saved in db
        em.detach(updatedPlay);
        updatedPlay.playedAt(UPDATED_PLAYED_AT).durationListened(UPDATED_DURATION_LISTENED);
        PlayDTO playDTO = playMapper.toDto(updatedPlay);

        restPlayMockMvc
            .perform(put(ENTITY_API_URL_ID, playDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playDTO)))
            .andExpect(status().isOk());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlayToMatchAllProperties(updatedPlay);
    }

    @Test
    @Transactional
    void putNonExistingPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(put(ENTITY_API_URL_ID, playDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlayWithPatch() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the play using partial update
        Play partialUpdatedPlay = new Play();
        partialUpdatedPlay.setId(play.getId());

        partialUpdatedPlay.durationListened(UPDATED_DURATION_LISTENED);

        restPlayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlay.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlay))
            )
            .andExpect(status().isOk());

        // Validate the Play in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlayUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPlay, play), getPersistedPlay(play));
    }

    @Test
    @Transactional
    void fullUpdatePlayWithPatch() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the play using partial update
        Play partialUpdatedPlay = new Play();
        partialUpdatedPlay.setId(play.getId());

        partialUpdatedPlay.playedAt(UPDATED_PLAYED_AT).durationListened(UPDATED_DURATION_LISTENED);

        restPlayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlay.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlay))
            )
            .andExpect(status().isOk());

        // Validate the Play in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlayUpdatableFieldsEquals(partialUpdatedPlay, getPersistedPlay(partialUpdatedPlay));
    }

    @Test
    @Transactional
    void patchNonExistingPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, playDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlay() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        play.setId(longCount.incrementAndGet());

        // Create the Play
        PlayDTO playDTO = playMapper.toDto(play);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlayMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Play in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlay() throws Exception {
        // Initialize the database
        insertedPlay = playRepository.saveAndFlush(play);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the play
        restPlayMockMvc
            .perform(delete(ENTITY_API_URL_ID, play.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return playRepository.count();
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

    protected Play getPersistedPlay(Play play) {
        return playRepository.findById(play.getId()).orElseThrow();
    }

    protected void assertPersistedPlayToMatchAllProperties(Play expectedPlay) {
        assertPlayAllPropertiesEquals(expectedPlay, getPersistedPlay(expectedPlay));
    }

    protected void assertPersistedPlayToMatchUpdatableProperties(Play expectedPlay) {
        assertPlayAllUpdatablePropertiesEquals(expectedPlay, getPersistedPlay(expectedPlay));
    }
}
