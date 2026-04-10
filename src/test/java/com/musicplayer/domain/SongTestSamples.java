package com.musicplayer.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class SongTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Song getSongSample1() {
        return new Song().id(1L).title("title1").duration(1).fileUrl("fileUrl1").coverImage("coverImage1");
    }

    public static Song getSongSample2() {
        return new Song().id(2L).title("title2").duration(2).fileUrl("fileUrl2").coverImage("coverImage2");
    }

    public static Song getSongRandomSampleGenerator() {
        return new Song()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .duration(intCount.incrementAndGet())
            .fileUrl(UUID.randomUUID().toString())
            .coverImage(UUID.randomUUID().toString());
    }
}
