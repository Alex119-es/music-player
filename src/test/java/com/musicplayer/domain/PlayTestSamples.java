package com.musicplayer.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PlayTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Play getPlaySample1() {
        return new Play().id(1L).durationListened(1);
    }

    public static Play getPlaySample2() {
        return new Play().id(2L).durationListened(2);
    }

    public static Play getPlayRandomSampleGenerator() {
        return new Play().id(longCount.incrementAndGet()).durationListened(intCount.incrementAndGet());
    }
}
