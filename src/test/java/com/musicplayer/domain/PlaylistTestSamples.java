package com.musicplayer.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PlaylistTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Playlist getPlaylistSample1() {
        return new Playlist().id(1L).name("name1").coverImage("coverImage1");
    }

    public static Playlist getPlaylistSample2() {
        return new Playlist().id(2L).name("name2").coverImage("coverImage2");
    }

    public static Playlist getPlaylistRandomSampleGenerator() {
        return new Playlist().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).coverImage(UUID.randomUUID().toString());
    }
}
