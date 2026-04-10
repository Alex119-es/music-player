package com.musicplayer.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AlbumTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Album getAlbumSample1() {
        return new Album().id(1L).title("title1").coverImage("coverImage1");
    }

    public static Album getAlbumSample2() {
        return new Album().id(2L).title("title2").coverImage("coverImage2");
    }

    public static Album getAlbumRandomSampleGenerator() {
        return new Album().id(longCount.incrementAndGet()).title(UUID.randomUUID().toString()).coverImage(UUID.randomUUID().toString());
    }
}
