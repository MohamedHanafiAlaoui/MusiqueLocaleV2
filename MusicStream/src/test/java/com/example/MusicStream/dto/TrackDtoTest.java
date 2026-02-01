package com.example.MusicStream.dto;

import com.example.MusicStream.entity.MusicCategory;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TrackDtoTest {

    @Test
    void trackDto_ShouldCreateWithAllArgsConstructor() {
        TrackDto trackDto = new TrackDto(
            1L,
            "Test Song",
            "Test Artist",
            "Test Description",
            180L,
            MusicCategory.pop,
            1024000L,
            "http://example.com/file.mp3",
            "http://example.com/cover.jpg"
        );

        assertEquals(1L, trackDto.getId());
        assertEquals("Test Song", trackDto.getTitle());
        assertEquals("Test Artist", trackDto.getArtist());
        assertEquals("Test Description", trackDto.getDescription());
        assertEquals(180L, trackDto.getDuration());
        assertEquals(MusicCategory.pop, trackDto.getCategory());
        assertEquals(1024000L, trackDto.getFileSize());
        assertEquals("http://example.com/file.mp3", trackDto.getFileUrl());
        assertEquals("http://example.com/cover.jpg", trackDto.getCoverImage());
    }

    @Test
    void trackDto_ShouldCreateWithNoArgsConstructor() {
        TrackDto trackDto = new TrackDto();

        assertNull(trackDto.getId());
        assertNull(trackDto.getTitle());
        assertNull(trackDto.getArtist());
        assertNull(trackDto.getDescription());
        assertNull(trackDto.getDuration());
        assertNull(trackDto.getCategory());
        assertNull(trackDto.getFileSize());
        assertNull(trackDto.getFileUrl());
        assertNull(trackDto.getCoverImage());
    }

    @Test
    void settersAndGetters_ShouldWorkCorrectly() {
        TrackDto trackDto = new TrackDto();

        trackDto.setId(2L);
        trackDto.setTitle("Updated Song");
        trackDto.setArtist("Updated Artist");
        trackDto.setDescription("Updated Description");
        trackDto.setDuration(240L);
        trackDto.setCategory(MusicCategory.rock);
        trackDto.setFileSize(2048000L);
        trackDto.setFileUrl("http://example.com/updated-file.mp3");
        trackDto.setCoverImage("http://example.com/updated-cover.jpg");

        assertEquals(2L, trackDto.getId());
        assertEquals("Updated Song", trackDto.getTitle());
        assertEquals("Updated Artist", trackDto.getArtist());
        assertEquals("Updated Description", trackDto.getDescription());
        assertEquals(240L, trackDto.getDuration());
        assertEquals(MusicCategory.rock, trackDto.getCategory());
        assertEquals(2048000L, trackDto.getFileSize());
        assertEquals("http://example.com/updated-file.mp3", trackDto.getFileUrl());
        assertEquals("http://example.com/updated-cover.jpg", trackDto.getCoverImage());
    }

    @Test
    void trackDto_ShouldHandleNullValues() {
        TrackDto trackDto = new TrackDto();
        trackDto.setTitle(null);
        trackDto.setArtist(null);
        trackDto.setDescription(null);
        trackDto.setFileUrl(null);
        trackDto.setCoverImage(null);

        assertNull(trackDto.getTitle());
        assertNull(trackDto.getArtist());
        assertNull(trackDto.getDescription());
        assertNull(trackDto.getFileUrl());
        assertNull(trackDto.getCoverImage());
    }

    @Test
    void trackDto_ShouldHandleEmptyStrings() {
        TrackDto trackDto = new TrackDto();
        trackDto.setTitle("");
        trackDto.setArtist("");
        trackDto.setDescription("");
        trackDto.setFileUrl("");
        trackDto.setCoverImage("");

        assertEquals("", trackDto.getTitle());
        assertEquals("", trackDto.getArtist());
        assertEquals("", trackDto.getDescription());
        assertEquals("", trackDto.getFileUrl());
        assertEquals("", trackDto.getCoverImage());
    }

    @Test
    void trackDto_ShouldHandleZeroValues() {
        TrackDto trackDto = new TrackDto();
        trackDto.setId(0L);
        trackDto.setDuration(0L);
        trackDto.setFileSize(0L);

        assertEquals(0L, trackDto.getId());
        assertEquals(0L, trackDto.getDuration());
        assertEquals(0L, trackDto.getFileSize());
    }

    @Test
    void trackDto_ShouldHandleAllMusicCategories() {
        TrackDto trackDto = new TrackDto();

        trackDto.setCategory(MusicCategory.pop);
        assertEquals(MusicCategory.pop, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.rock);
        assertEquals(MusicCategory.rock, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.rap);
        assertEquals(MusicCategory.rap, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.jazz);
        assertEquals(MusicCategory.jazz, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.classical);
        assertEquals(MusicCategory.classical, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.electronic);
        assertEquals(MusicCategory.electronic, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.reggae);
        assertEquals(MusicCategory.reggae, trackDto.getCategory());

        trackDto.setCategory(MusicCategory.other);
        assertEquals(MusicCategory.other, trackDto.getCategory());
    }

    @Test
    void trackDto_ShouldHandleLargeValues() {
        TrackDto trackDto = new TrackDto();
        
        Long largeId = Long.MAX_VALUE;
        Long largeDuration = 999999999L;
        Long largeFileSize = Long.MAX_VALUE;

        trackDto.setId(largeId);
        trackDto.setDuration(largeDuration);
        trackDto.setFileSize(largeFileSize);

        assertEquals(largeId, trackDto.getId());
        assertEquals(largeDuration, trackDto.getDuration());
        assertEquals(largeFileSize, trackDto.getFileSize());
    }

    @Test
    void trackDto_ShouldHandleSpecialCharacters() {
        TrackDto trackDto = new TrackDto();
        
        String specialTitle = "Song with émojis 🎵 & spéci@l chars!";
        String specialArtist = "Artist with ñ and ümlauts";
        String specialDescription = "Description with quotes \" and apostrophes '";

        trackDto.setTitle(specialTitle);
        trackDto.setArtist(specialArtist);
        trackDto.setDescription(specialDescription);

        assertEquals(specialTitle, trackDto.getTitle());
        assertEquals(specialArtist, trackDto.getArtist());
        assertEquals(specialDescription, trackDto.getDescription());
    }
}
