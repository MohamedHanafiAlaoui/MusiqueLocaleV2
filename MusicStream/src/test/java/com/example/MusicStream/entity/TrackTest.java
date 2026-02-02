package com.example.MusicStream.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TrackTest {

    @Test
    void track_ShouldCreateWithAllArgsConstructor() {
        Track track = new Track(
            1L,
            "Test Song",
            "Test Artist",
            "Test Description",
            MusicCategory.pop,
            180L,
            1024000L,
            "http://example.com/file.mp3",
            "http://example.com/cover.jpg"
        );

        assertEquals(1L, track.getId());
        assertEquals("Test Song", track.getTitle());
        assertEquals("Test Artist", track.getArtist());
        assertEquals("Test Description", track.getDescription());
        assertEquals(MusicCategory.pop, track.getCategory());
        assertEquals(180L, track.getDuration());
        assertEquals(1024000L, track.getFileSize());
        assertEquals("http://example.com/file.mp3", track.getFileUrl());
        assertEquals("http://example.com/cover.jpg", track.getCoverImage());
    }

    @Test
    void track_ShouldCreateWithNoArgsConstructor() {
        Track track = new Track();

        assertNull(track.getId());
        assertNull(track.getTitle());
        assertNull(track.getArtist());
        assertNull(track.getDescription());
        assertNull(track.getCategory());
        assertNull(track.getDuration());
        assertNull(track.getFileSize());
        assertNull(track.getFileUrl());
        assertNull(track.getCoverImage());
    }

    @Test
    void settersAndGetters_ShouldWorkCorrectly() {
        Track track = new Track();

        track.setId(2L);
        track.setTitle("Updated Song");
        track.setArtist("Updated Artist");
        track.setDescription("Updated Description");
        track.setCategory(MusicCategory.rock);
        track.setDuration(240L);
        track.setFileSize(2048000L);
        track.setFileUrl("http://example.com/updated-file.mp3");
        track.setCoverImage("http://example.com/updated-cover.jpg");

        assertEquals(2L, track.getId());
        assertEquals("Updated Song", track.getTitle());
        assertEquals("Updated Artist", track.getArtist());
        assertEquals("Updated Description", track.getDescription());
        assertEquals(MusicCategory.rock, track.getCategory());
        assertEquals(240L, track.getDuration());
        assertEquals(2048000L, track.getFileSize());
        assertEquals("http://example.com/updated-file.mp3", track.getFileUrl());
        assertEquals("http://example.com/updated-cover.jpg", track.getCoverImage());
    }

    @Test
    void track_ShouldHandleNullValues() {
        Track track = new Track();
        track.setTitle(null);
        track.setArtist(null);
        track.setDescription(null);
        track.setFileUrl(null);
        track.setCoverImage(null);

        assertNull(track.getTitle());
        assertNull(track.getArtist());
        assertNull(track.getDescription());
        assertNull(track.getFileUrl());
        assertNull(track.getCoverImage());
    }

    @Test
    void track_ShouldHandleEmptyStrings() {
        Track track = new Track();
        track.setTitle("");
        track.setArtist("");
        track.setDescription("");
        track.setFileUrl("");
        track.setCoverImage("");

        assertEquals("", track.getTitle());
        assertEquals("", track.getArtist());
        assertEquals("", track.getDescription());
        assertEquals("", track.getFileUrl());
        assertEquals("", track.getCoverImage());
    }

    @Test
    void track_ShouldHandleZeroValues() {
        Track track = new Track();
        track.setId(0L);
        track.setDuration(0L);
        track.setFileSize(0L);

        assertEquals(0L, track.getId());
        assertEquals(0L, track.getDuration());
        assertEquals(0L, track.getFileSize());
    }

    @Test
    void track_ShouldHandleAllMusicCategories() {
        Track track = new Track();

        track.setCategory(MusicCategory.pop);
        assertEquals(MusicCategory.pop, track.getCategory());

        track.setCategory(MusicCategory.rock);
        assertEquals(MusicCategory.rock, track.getCategory());

        track.setCategory(MusicCategory.rap);
        assertEquals(MusicCategory.rap, track.getCategory());

        track.setCategory(MusicCategory.jazz);
        assertEquals(MusicCategory.jazz, track.getCategory());

        track.setCategory(MusicCategory.classical);
        assertEquals(MusicCategory.classical, track.getCategory());

        track.setCategory(MusicCategory.electronic);
        assertEquals(MusicCategory.electronic, track.getCategory());

        track.setCategory(MusicCategory.reggae);
        assertEquals(MusicCategory.reggae, track.getCategory());

        track.setCategory(MusicCategory.other);
        assertEquals(MusicCategory.other, track.getCategory());
    }
}
