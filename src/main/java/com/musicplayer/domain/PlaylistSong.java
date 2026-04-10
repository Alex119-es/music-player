package com.musicplayer.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PlaylistSong.
 */
@Entity
@Table(name = "playlist_song")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PlaylistSong implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "position")
    private Integer position;

    @Column(name = "added_at")
    private Instant addedAt;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Playlist playlist;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "album", "genre", "artistses" }, allowSetters = true)
    private Song song;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PlaylistSong id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosition() {
        return this.position;
    }

    public PlaylistSong position(Integer position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Instant getAddedAt() {
        return this.addedAt;
    }

    public PlaylistSong addedAt(Instant addedAt) {
        this.setAddedAt(addedAt);
        return this;
    }

    public void setAddedAt(Instant addedAt) {
        this.addedAt = addedAt;
    }

    public Playlist getPlaylist() {
        return this.playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public PlaylistSong playlist(Playlist playlist) {
        this.setPlaylist(playlist);
        return this;
    }

    public Song getSong() {
        return this.song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public PlaylistSong song(Song song) {
        this.setSong(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PlaylistSong)) {
            return false;
        }
        return getId() != null && getId().equals(((PlaylistSong) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PlaylistSong{" +
            "id=" + getId() +
            ", position=" + getPosition() +
            ", addedAt='" + getAddedAt() + "'" +
            "}";
    }
}
