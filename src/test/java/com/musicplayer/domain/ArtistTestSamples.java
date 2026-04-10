package com.musicplayer.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ArtistTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Artist getArtistSample1() {
        return new Artist().id(1L).name("name1").image("image1").country("country1");
    }

    public static Artist getArtistSample2() {
        return new Artist().id(2L).name("name2").image("image2").country("country2");
    }

    public static Artist getArtistRandomSampleGenerator() {
        return new Artist()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .image(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString());
    }
}
