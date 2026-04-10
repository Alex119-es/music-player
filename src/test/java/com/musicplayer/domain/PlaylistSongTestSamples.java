package com.musicplayer.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PlaylistSongTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static PlaylistSong getPlaylistSongSample1() {
        return new PlaylistSong().id(1L).position(1);
    }

    public static PlaylistSong getPlaylistSongSample2() {
        return new PlaylistSong().id(2L).position(2);
    }

    public static PlaylistSong getPlaylistSongRandomSampleGenerator() {
        return new PlaylistSong().id(longCount.incrementAndGet()).position(intCount.incrementAndGet());
    }
}
