package com.musicplayer.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.musicplayer.domain.PlaylistSong} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PlaylistSongDTO implements Serializable {

    private Long id;

    private Integer position;

    private Instant addedAt;

    @NotNull
    private PlaylistDTO playlist;

    @NotNull
    private SongDTO song;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Instant getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Instant addedAt) {
        this.addedAt = addedAt;
    }

    public PlaylistDTO getPlaylist() {
        return playlist;
    }

    public void setPlaylist(PlaylistDTO playlist) {
        this.playlist = playlist;
    }

    public SongDTO getSong() {
        return song;
    }

    public void setSong(SongDTO song) {
        this.song = song;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlaylistSongDTO)) {
            return false;
        }

        PlaylistSongDTO playlistSongDTO = (PlaylistSongDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, playlistSongDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PlaylistSongDTO{" +
            "id=" + getId() +
            ", position=" + getPosition() +
            ", addedAt='" + getAddedAt() + "'" +
            ", playlist=" + getPlaylist() +
            ", song=" + getSong() +
            "}";
    }
}
