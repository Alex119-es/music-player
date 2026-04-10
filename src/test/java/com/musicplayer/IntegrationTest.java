package com.musicplayer;

import com.musicplayer.config.AsyncSyncConfiguration;
import com.musicplayer.config.EmbeddedSQL;
import com.musicplayer.config.JacksonConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        MusicPlayerApp.class,
        JacksonConfiguration.class,
        AsyncSyncConfiguration.class,
        com.musicplayer.config.JacksonHibernateConfiguration.class,
    }
)
@EmbeddedSQL
public @interface IntegrationTest {}
