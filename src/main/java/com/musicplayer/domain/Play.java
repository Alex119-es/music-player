package com.musicplayer.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Play.
 */
@Entity
@Table(name = "play")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Play implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "played_at")
    private Instant playedAt;

    @Column(name = "duration_listened")
    private Integer durationListened;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "album", "genre", "artistses" }, allowSetters = true)
    private Song song;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Play id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getPlayedAt() {
        return this.playedAt;
    }

    public Play playedAt(Instant playedAt) {
        this.setPlayedAt(playedAt);
        return this;
    }

    public void setPlayedAt(Instant playedAt) {
        this.playedAt = playedAt;
    }

    public Integer getDurationListened() {
        return this.durationListened;
    }

    public Play durationListened(Integer durationListened) {
        this.setDurationListened(durationListened);
        return this;
    }

    public void setDurationListened(Integer durationListened) {
        this.durationListened = durationListened;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Play user(User user) {
        this.setUser(user);
        return this;
    }

    public Song getSong() {
        return this.song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public Play song(Song song) {
        this.setSong(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Play)) {
            return false;
        }
        return getId() != null && getId().equals(((Play) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Play{" +
            "id=" + getId() +
            ", playedAt='" + getPlayedAt() + "'" +
            ", durationListened=" + getDurationListened() +
            "}";
    }
}
