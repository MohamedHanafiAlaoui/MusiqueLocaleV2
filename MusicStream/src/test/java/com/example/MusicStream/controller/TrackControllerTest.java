package com.example.MusicStream.controller;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.service.TrackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackControllerTest {

    @Mock
    private TrackService trackService;

    @InjectMocks
    private TrackController trackController;

    private TrackDto testTrackDto;
    private MultipartFile testFile;
    private Page<TrackDto> testTrackPage;

    @BeforeEach
    void setUp() {
        testTrackDto = new TrackDto();
        testTrackDto.setId(1L);
        testTrackDto.setTitle("Test Song");
        testTrackDto.setArtist("Test Artist");
        testTrackDto.setCategory(MusicCategory.pop);
        testTrackDto.setDescription("Test Description");
        testTrackDto.setDuration(180L);
        testTrackDto.setCoverImage("test-cover.jpg");

        testFile = new MockMultipartFile(
            "file",
            "test-song.mp3",
            "audio/mpeg",
            "test audio content".getBytes()
        );

        List<TrackDto> tracks = Arrays.asList(testTrackDto);
        testTrackPage = new PageImpl<>(tracks, PageRequest.of(0, 8), 1);
    }

    @Test
    void create_ShouldReturnTrackDto_WhenValidInput() {
        when(trackService.createWithFile(any(TrackDto.class), any(MultipartFile.class)))
            .thenReturn(testTrackDto);

        TrackDto result = trackController.create(
            "Test Song",
            "Test Artist",
            "pop",
            "Test Description",
            "180",
            "test-cover.jpg",
            testFile
        );

        assertNotNull(result);
        assertEquals("Test Song", result.getTitle());
        assertEquals("Test Artist", result.getArtist());
        assertEquals(MusicCategory.pop, result.getCategory());
        assertEquals("Test Description", result.getDescription());
        assertEquals(180L, result.getDuration());
        assertEquals("test-cover.jpg", result.getCoverImage());

        verify(trackService).createWithFile(any(TrackDto.class), eq(testFile));
    }

    @Test
    void create_ShouldHandleNullDescriptionAndDuration() {
        when(trackService.createWithFile(any(TrackDto.class), any(MultipartFile.class)))
            .thenReturn(testTrackDto);

        TrackDto result = trackController.create(
            "Test Song",
            "Test Artist",
            "pop",
            null,
            null,
            null,
            testFile
        );

        assertNotNull(result);
        verify(trackService).createWithFile(any(TrackDto.class), eq(testFile));
    }

    @Test
    void search_ShouldReturnPageOfTracks_WhenCalledWithParameters() {
        when(trackService.search(anyString(), any(MusicCategory.class), any(Pageable.class)))
            .thenReturn(testTrackPage);

        Page<TrackDto> result = trackController.search(
            "Test Song",
            MusicCategory.pop,
            0,
            8
        );

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Song", result.getContent().get(0).getTitle());

        verify(trackService).search(eq("Test Song"), eq(MusicCategory.pop), any(Pageable.class));
    }

    @Test
    void search_ShouldReturnPageOfTracks_WhenCalledWithNullParameters() {
        when(trackService.search(isNull(), isNull(), any(Pageable.class)))
            .thenReturn(testTrackPage);

        Page<TrackDto> result = trackController.search(
            null,
            null,
            0,
            8
        );

        assertNotNull(result);
        assertEquals(1, result.getContent().size());

        verify(trackService).search(isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void show_ShouldReturnTrackDto_WhenValidId() {
        when(trackService.show(1L)).thenReturn(testTrackDto);

        TrackDto result = trackController.show(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Song", result.getTitle());

        verify(trackService).show(1L);
    }

    @Test
    void update_ShouldReturnUpdatedTrackDto_WhenValidInput() {
        TrackDto updatedTrack = new TrackDto();
        updatedTrack.setId(1L);
        updatedTrack.setTitle("Updated Song");
        updatedTrack.setArtist("Updated Artist");
        updatedTrack.setCategory(MusicCategory.rock);
        updatedTrack.setDescription("Updated Description");
        updatedTrack.setDuration(200L);
        updatedTrack.setCoverImage("updated-cover.jpg");

        when(trackService.updateWithFile(eq(1L), any(TrackDto.class), any(MultipartFile.class)))
            .thenReturn(updatedTrack);

        TrackDto result = trackController.update(
            1L,
            "Updated Song",
            "Updated Artist",
            "rock",
            "Updated Description",
            "200",
            "updated-cover.jpg",
            testFile
        );

        assertNotNull(result);
        assertEquals("Updated Song", result.getTitle());
        assertEquals("Updated Artist", result.getArtist());
        assertEquals(MusicCategory.rock, result.getCategory());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(200L, result.getDuration());
        assertEquals("updated-cover.jpg", result.getCoverImage());

        verify(trackService).updateWithFile(eq(1L), any(TrackDto.class), eq(testFile));
    }

    @Test
    void update_ShouldHandleNullDescriptionAndDuration() {
        when(trackService.updateWithFile(eq(1L), any(TrackDto.class), any(MultipartFile.class)))
            .thenReturn(testTrackDto);

        TrackDto result = trackController.update(
            1L,
            "Test Song",
            "Test Artist",
            "pop",
            null,
            null,
            null,
            testFile
        );

        assertNotNull(result);
        verify(trackService).updateWithFile(eq(1L), any(TrackDto.class), eq(testFile));
    }

    @Test
    void update_ShouldHandleNullFile() {
        when(trackService.updateWithFile(eq(1L), any(TrackDto.class), isNull()))
            .thenReturn(testTrackDto);

        TrackDto result = trackController.update(
            1L,
            "Test Song",
            "Test Artist",
            "pop",
            "Test Description",
            "180",
            "test-cover.jpg",
            null
        );

        assertNotNull(result);
        verify(trackService).updateWithFile(eq(1L), any(TrackDto.class), isNull());
    }

    @Test
    void delete_ShouldCallServiceDelete_WhenValidId() {
        doNothing().when(trackService).delete(1L);

        trackController.delete(1L);

        verify(trackService).delete(1L);
    }

    @Test
    void create_ShouldParseDurationCorrectly_WhenStringProvided() {
        TrackDto trackWithDuration = new TrackDto();
        trackWithDuration.setDuration(300L);

        when(trackService.createWithFile(any(TrackDto.class), any(MultipartFile.class)))
            .thenReturn(trackWithDuration);

        TrackDto result = trackController.create(
            "Test Song",
            "Test Artist",
            "pop",
            null,
            "300",
            null,
            testFile
        );

        assertNotNull(result);
        assertEquals(300L, result.getDuration());
    }

    @Test
    void search_ShouldUseDefaultPagination_WhenNotProvided() {
        when(trackService.search(isNull(), isNull(), any(Pageable.class)))
            .thenReturn(testTrackPage);

        trackController.search(null, null, 0, 8);

        verify(trackService).search(isNull(), isNull(), any(Pageable.class));
    }
}
