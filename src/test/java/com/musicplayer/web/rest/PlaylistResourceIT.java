package com.musicplayer.web.rest;

import static com.musicplayer.domain.PlaylistAsserts.*;
import static com.musicplayer.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicplayer.IntegrationTest;
import com.musicplayer.domain.Playlist;
import com.musicplayer.domain.User;
import com.musicplayer.repository.PlaylistRepository;
import com.musicplayer.repository.UserRepository;
import com.musicplayer.service.dto.PlaylistDTO;
import com.musicplayer.service.mapper.PlaylistMapper;
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
 * Integration tests for the {@link PlaylistResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlaylistResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_PUBLIC = false;
    private static final Boolean UPDATED_IS_PUBLIC = true;

    private static final String DEFAULT_COVER_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_COVER_IMAGE = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/playlists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlaylistMapper playlistMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlaylistMockMvc;

    private Playlist playlist;

    private Playlist insertedPlaylist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Playlist createEntity(EntityManager em) {
        Playlist playlist = new Playlist()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .isPublic(DEFAULT_IS_PUBLIC)
            .coverImage(DEFAULT_COVER_IMAGE)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        playlist.setUser(user);
        return playlist;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Playlist createUpdatedEntity(EntityManager em) {
        Playlist updatedPlaylist = new Playlist()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .isPublic(UPDATED_IS_PUBLIC)
            .coverImage(UPDATED_COVER_IMAGE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        // Add required entity
        User user = UserResourceIT.createEntity();
        em.persist(user);
        em.flush();
        updatedPlaylist.setUser(user);
        return updatedPlaylist;
    }

    @BeforeEach
    void initTest() {
        playlist = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedPlaylist != null) {
            playlistRepository.delete(insertedPlaylist);
            insertedPlaylist = null;
        }
    }

    @Test
    @Transactional
    void createPlaylist() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);
        var returnedPlaylistDTO = om.readValue(
            restPlaylistMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            PlaylistDTO.class
        );

        // Validate the Playlist in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedPlaylist = playlistMapper.toEntity(returnedPlaylistDTO);
        assertPlaylistUpdatableFieldsEquals(returnedPlaylist, getPersistedPlaylist(returnedPlaylist));

        insertedPlaylist = returnedPlaylist;
    }

    @Test
    @Transactional
    void createPlaylistWithExistingId() throws Exception {
        // Create the Playlist with an existing ID
        playlist.setId(1L);
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        playlist.setName(null);

        // Create the Playlist, which fails.
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        restPlaylistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPlaylists() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        // Get all the playlistList
        restPlaylistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playlist.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].isPublic").value(hasItem(DEFAULT_IS_PUBLIC)))
            .andExpect(jsonPath("$.[*].coverImage").value(hasItem(DEFAULT_COVER_IMAGE)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getPlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        // Get the playlist
        restPlaylistMockMvc
            .perform(get(ENTITY_API_URL_ID, playlist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(playlist.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.isPublic").value(DEFAULT_IS_PUBLIC))
            .andExpect(jsonPath("$.coverImage").value(DEFAULT_COVER_IMAGE))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingPlaylist() throws Exception {
        // Get the playlist
        restPlaylistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist
        Playlist updatedPlaylist = playlistRepository.findById(playlist.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPlaylist are not directly saved in db
        em.detach(updatedPlaylist);
        updatedPlaylist
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .isPublic(UPDATED_IS_PUBLIC)
            .coverImage(UPDATED_COVER_IMAGE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        PlaylistDTO playlistDTO = playlistMapper.toDto(updatedPlaylist);

        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playlistDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistDTO))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedPlaylistToMatchAllProperties(updatedPlaylist);
    }

    @Test
    @Transactional
    void putNonExistingPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, playlistDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(playlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(playlistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlaylistWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist using partial update
        Playlist partialUpdatedPlaylist = new Playlist();
        partialUpdatedPlaylist.setId(playlist.getId());

        partialUpdatedPlaylist.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).createdAt(UPDATED_CREATED_AT);

        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylist))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedPlaylist, playlist), getPersistedPlaylist(playlist));
    }

    @Test
    @Transactional
    void fullUpdatePlaylistWithPatch() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the playlist using partial update
        Playlist partialUpdatedPlaylist = new Playlist();
        partialUpdatedPlaylist.setId(playlist.getId());

        partialUpdatedPlaylist
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .isPublic(UPDATED_IS_PUBLIC)
            .coverImage(UPDATED_COVER_IMAGE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlaylist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedPlaylist))
            )
            .andExpect(status().isOk());

        // Validate the Playlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPlaylistUpdatableFieldsEquals(partialUpdatedPlaylist, getPersistedPlaylist(partialUpdatedPlaylist));
    }

    @Test
    @Transactional
    void patchNonExistingPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, playlistDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(playlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlaylist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        playlist.setId(longCount.incrementAndGet());

        // Create the Playlist
        PlaylistDTO playlistDTO = playlistMapper.toDto(playlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlaylistMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(playlistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Playlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlaylist() throws Exception {
        // Initialize the database
        insertedPlaylist = playlistRepository.saveAndFlush(playlist);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the playlist
        restPlaylistMockMvc
            .perform(delete(ENTITY_API_URL_ID, playlist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return playlistRepository.count();
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

    protected Playlist getPersistedPlaylist(Playlist playlist) {
        return playlistRepository.findById(playlist.getId()).orElseThrow();
    }

    protected void assertPersistedPlaylistToMatchAllProperties(Playlist expectedPlaylist) {
        assertPlaylistAllPropertiesEquals(expectedPlaylist, getPersistedPlaylist(expectedPlaylist));
    }

    protected void assertPersistedPlaylistToMatchUpdatableProperties(Playlist expectedPlaylist) {
        assertPlaylistAllUpdatablePropertiesEquals(expectedPlaylist, getPersistedPlaylist(expectedPlaylist));
    }
}
