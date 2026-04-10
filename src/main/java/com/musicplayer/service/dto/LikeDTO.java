package com.musicplayer.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.musicplayer.domain.Like} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LikeDTO implements Serializable {

    private Long id;

    private Instant createdAt;

    private UserDTO user;

    private SongDTO song;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
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
        if (!(o instanceof LikeDTO)) {
            return false;
        }

        LikeDTO likeDTO = (LikeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, likeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LikeDTO{" +
            "id=" + getId() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", user=" + getUser() +
            ", song=" + getSong() +
            "}";
    }
}
