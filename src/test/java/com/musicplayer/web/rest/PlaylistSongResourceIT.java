package com.musicplayer.web.rest;

import static com.musicplayer.domain.PlaylistSongAsserts.*;
import static com.musicplayer.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.IntegrationTest;
import com.musicplayer.domain.Playlist;
import com.musicplayer.domain.PlaylistSong;
import com.musicplayer.domain.Song;
import com.musicplayer.repository.PlaylistSongRepository;
import com.musicplayer.service.dto.PlaylistSongDTO;
import com.musicplayer.service.mapper.PlaylistSongMapper;
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
 * Integration tests for the {@link PlaylistSongResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlaylistSongResourceIT {

    private static final Integer DEFAULT_POSITION = 1;
    private static final Integer UPDATED_POSITION = 2;

    private static final Instant DEFAULT_ADDED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ADDED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/playlist-songs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlaylistSongRepository playlistSongRepository;

    @Autowired
    private PlaylistSongMapper playlistSongMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlaylistSongMockMvc;

    private PlaylistSong playlistSong;

    private PlaylistSong insertedPlaylistSong;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaylistSong createEntity(EntityManager em) {
        PlaylistSong playlistSong = new PlaylistSong().position(DEFAULT_POSITION).addedAt(DEFAULT_ADDED_AT);
        // Add required entity
        Playlist playlist;
        if (TestUtil.findAll(em, Playlist.class).isEmpty()) {
            playlist = PlaylistResourceIT.createEntity(em);
            em.persist(playlist);
            em.flush();
        } else {
            playlist = TestUtil.findAll(em, Playlist.class).get(0);
        }
        playlistSong.setPlaylist(playlist);
        // Add required entity
        Song song;
        if (TestUtil.findAll(em, Song.class).isEmpty()) {
            song = SongResourceIT.createEntity();
            em.persist(song);
            em.flush();
        } else {
            song = TestUtil.findAll(em, Song.class).get(0);
        }
        playlistSong.setSong(song);
        return playlistSong;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PlaylistSong createUpdatedEntity(EntityManager em) {
        PlaylistSong updatedPlaylistSong = new PlaylistSong().position(UPDATED_POSITION).addedAt(UPDATED_ADDED_AT);
        // Add required entity
        Playlist playlist;
        if (TestUtil.findAll(em, Playlist.class).isEmpty()) {
            playlist = PlaylistResourceIT.createUpdatedEntity(em);
            em.persist(playlist);
            em.flush();
        } else {
            playlist = TestUtil.findAll(em, Playlist.class).get(0);
        }
        updatedPlaylistSong.setPlaylist(playlist);
        // Add required entity
        Song song;
        if (TestUtil.findAll(em, Song.class).isEmpty()) {
            song = SongResourceIT.createUpdatedEntity();
            em.persist(song);
            em.flush();
        } else {
            song = TestUtil.findAll(em, Song.class).get(0);
        }
        updatedPlaylistSong.setSong(song);
        return updatedPlaylistSong;
    }

    @BeforeEach
    void initTest() {
        playlistSong = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedPlaylistSong != null) {
            playlistSongRepository.delete(insertedPlaylistSong);
            insertedPlaylistSong = null;
        }
    }

    @Test
    @Transactional
    void createPlaylistSong() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);
        var returnedPlaylistSongDTO = om.readValue(
            restPlaylistSongMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistSongDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PlaylistSongDTO.class
        );

        // Validate the PlaylistSong in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPlaylistSong = playlistSongMapper.toEntity(returnedPlaylistSongDTO);
        assertPlaylistSongUpdatableFieldsEquals(returnedPlaylistSong, getPersistedPlaylistSong(returnedPlaylistSong));

        insertedPlaylistSong = returnedPlaylistSong;
    }

    @Test
    @Transactional
    void createPlaylistSongWithExistingId() throws Exception {
        // Create the PlaylistSong with an existing ID
        playlistSong.setId(1L);
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaylistSongMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistSongDTO)))
            .andExpect(status().isBadRequest());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlaylistSongs() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        // Get all the playlistSongList
        restPlaylistSongMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playlistSong.getId().intValue())))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].addedAt").value(hasItem(DEFAULT_ADDED_AT.toString())));
    }

    @Test
    @Transactional
    void getPlaylistSong() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        // Get the playlistSong
        restPlaylistSongMockMvc
            .perform(get(ENTITY_API_URL_ID, playlistSong.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(playlistSong.getId().intValue()))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.addedAt").value(DEFAULT_ADDED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPlaylistSong() throws Exception {
        // Get the playlistSong
        restPlaylistSongMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlaylistSong() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlistSong
        PlaylistSong updatedPlaylistSong = playlistSongRepository.findById(playlistSong.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlaylistSong are not directly saved in db
        em.detach(updatedPlaylistSong);
        updatedPlaylistSong.position(UPDATED_POSITION).addedAt(UPDATED_ADDED_AT);
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(updatedPlaylistSong);

        restPlaylistSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playlistSongDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistSongDTO))
            )
            .andExpect(status().isOk());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlaylistSongToMatchAllProperties(updatedPlaylistSong);
    }

    @Test
    @Transactional
    void putNonExistingPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playlistSongDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistSongDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistSongDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistSongDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlaylistSongWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlistSong using partial update
        PlaylistSong partialUpdatedPlaylistSong = new PlaylistSong();
        partialUpdatedPlaylistSong.setId(playlistSong.getId());

        partialUpdatedPlaylistSong.position(UPDATED_POSITION).addedAt(UPDATED_ADDED_AT);

        restPlaylistSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylistSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylistSong))
            )
            .andExpect(status().isOk());

        // Validate the PlaylistSong in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistSongUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedPlaylistSong, playlistSong),
            getPersistedPlaylistSong(playlistSong)
        );
    }

    @Test
    @Transactional
    void fullUpdatePlaylistSongWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlistSong using partial update
        PlaylistSong partialUpdatedPlaylistSong = new PlaylistSong();
        partialUpdatedPlaylistSong.setId(playlistSong.getId());

        partialUpdatedPlaylistSong.position(UPDATED_POSITION).addedAt(UPDATED_ADDED_AT);

        restPlaylistSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylistSong.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylistSong))
            )
            .andExpect(status().isOk());

        // Validate the PlaylistSong in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistSongUpdatableFieldsEquals(partialUpdatedPlaylistSong, getPersistedPlaylistSong(partialUpdatedPlaylistSong));
    }

    @Test
    @Transactional
    void patchNonExistingPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, playlistSongDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlistSongDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlistSongDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlaylistSong() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlistSong.setId(longCount.incrementAndGet());

        // Create the PlaylistSong
        PlaylistSongDTO playlistSongDTO = playlistSongMapper.toDto(playlistSong);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistSongMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playlistSongDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the PlaylistSong in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlaylistSong() throws Exception {
        // Initialize the database
        insertedPlaylistSong = playlistSongRepository.saveAndFlush(playlistSong);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the playlistSong
        restPlaylistSongMockMvc
            .perform(delete(ENTITY_API_URL_ID, playlistSong.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return playlistSongRepository.count();
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

    protected PlaylistSong getPersistedPlaylistSong(PlaylistSong playlistSong) {
        return playlistSongRepository.findById(playlistSong.getId()).orElseThrow();
    }

    protected void assertPersistedPlaylistSongToMatchAllProperties(PlaylistSong expectedPlaylistSong) {
        assertPlaylistSongAllPropertiesEquals(expectedPlaylistSong, getPersistedPlaylistSong(expectedPlaylistSong));
    }

    protected void assertPersistedPlaylistSongToMatchUpdatableProperties(PlaylistSong expectedPlaylistSong) {
        assertPlaylistSongAllUpdatablePropertiesEquals(expectedPlaylistSong, getPersistedPlaylistSong(expectedPlaylistSong));
    }
}
