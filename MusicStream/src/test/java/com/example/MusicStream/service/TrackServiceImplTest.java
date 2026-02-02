package com.example.MusicStream.service;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.entity.Track;
import com.example.MusicStream.mapper.TrackMapper;
import com.example.MusicStream.repository.TrackRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackServiceImplTest {

    @Mock
    private TrackRepository trackRepository;

    @Mock
    private TrackMapper trackMapper;

    @InjectMocks
    private TrackServiceImpl trackService;

    @TempDir
    Path tempDir;

    private Track testTrack;
    private TrackDto testTrackDto;
    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testTrack = new Track();
        testTrack.setId(1L);
        testTrack.setTitle("Test Song");
        testTrack.setArtist("Test Artist");
        testTrack.setCategory(MusicCategory.pop);
        testTrack.setDescription("Test Description");
        testTrack.setDuration(180L);
        testTrack.setCoverImage("test-cover.jpg");

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
    }

    @Test
    void create_ShouldReturnTrackDto_WhenValidInput() {
        when(trackMapper.toEntity(testTrackDto)).thenReturn(testTrack);
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);
        when(trackRepository.save(testTrack)).thenReturn(testTrack);

        TrackDto result = trackService.create(testTrackDto);

        assertNotNull(result);
        assertEquals(testTrackDto.getTitle(), result.getTitle());
        assertEquals(testTrackDto.getArtist(), result.getArtist());
        assertEquals(testTrackDto.getCategory(), result.getCategory());

        verify(trackMapper).toEntity(testTrackDto);
        verify(trackRepository).save(testTrack);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void createWithFile_ShouldReturnTrackDto_WhenValidInput() {
        TrackDto inputDto = new TrackDto();
        inputDto.setTitle("Test Song");
        inputDto.setArtist("Test Artist");
        inputDto.setCategory(MusicCategory.pop);
        inputDto.setDescription("Test Description");
        inputDto.setDuration(180L);
        inputDto.setCoverImage("test-cover.jpg");

        Track savedTrack = new Track();
        savedTrack.setId(1L);
        savedTrack.setTitle("Test Song");
        savedTrack.setArtist("Test Artist");
        savedTrack.setCategory(MusicCategory.pop);
        savedTrack.setDescription("Test Description");
        savedTrack.setDuration(180L);
        savedTrack.setCoverImage("test-cover.jpg");
        savedTrack.setFileUrl("http://localhost/uploads/music/test-file.mp3");
        savedTrack.setFileSize(testFile.getSize());

        when(trackMapper.toEntity(inputDto)).thenReturn(savedTrack);
        when(trackMapper.toDto(savedTrack)).thenReturn(testTrackDto);
        when(trackRepository.save(savedTrack)).thenReturn(savedTrack);

        TrackDto result = trackService.create(inputDto);

        assertNotNull(result);
        assertEquals(testTrackDto.getTitle(), result.getTitle());
        assertEquals(testTrackDto.getArtist(), result.getArtist());

        verify(trackRepository).save(savedTrack);
    }

    @Test
    void createWithFile_ShouldThrowRuntimeException_WhenIOExceptionOccurs() throws IOException {
        MultipartFile invalidFile = mock(MultipartFile.class);
        when(invalidFile.getOriginalFilename()).thenReturn("test.mp3");
        when(invalidFile.getInputStream()).thenThrow(new IOException("Test exception"));

        assertThrows(RuntimeException.class, () -> {
            trackService.createWithFile(testTrackDto, invalidFile);
        });
    }

    @Test
    void show_ShouldReturnTrackDto_WhenValidId() {
        when(trackRepository.findById(1L)).thenReturn(Optional.of(testTrack));
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);

        TrackDto result = trackService.show(1L);

        assertNotNull(result);
        assertEquals(testTrackDto.getId(), result.getId());
        assertEquals(testTrackDto.getTitle(), result.getTitle());

        verify(trackRepository).findById(1L);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void show_ShouldThrowRuntimeException_WhenInvalidId() {
        when(trackRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            trackService.show(999L);
        });

        verify(trackRepository).findById(999L);
    }

    @Test
    void update_ShouldReturnUpdatedTrackDto_WhenValidId() {
        Track existingTrack = new Track();
        existingTrack.setId(1L);
        existingTrack.setTitle("Old Song");
        existingTrack.setArtist("Old Artist");
        existingTrack.setCategory(MusicCategory.rock);
        existingTrack.setDescription("Old Description");
        existingTrack.setDuration(120L);
        existingTrack.setCoverImage("old-cover.jpg");

        TrackDto updateDto = new TrackDto();
        updateDto.setTitle("Updated Song");
        updateDto.setArtist("Updated Artist");
        updateDto.setCategory(MusicCategory.pop);
        updateDto.setDescription("Updated Description");
        updateDto.setDuration(200L);
        updateDto.setCoverImage("updated-cover.jpg");

        when(trackRepository.findById(1L)).thenReturn(Optional.of(existingTrack));
        when(trackRepository.save(existingTrack)).thenReturn(existingTrack);
        when(trackMapper.toDto(existingTrack)).thenReturn(updateDto);

        TrackDto result = trackService.update(1L, updateDto);

        assertNotNull(result);
        assertEquals("Updated Song", result.getTitle());
        assertEquals("Updated Artist", result.getArtist());
        assertEquals(MusicCategory.pop, result.getCategory());
        assertEquals("Updated Description", result.getDescription());
        assertEquals(200L, result.getDuration());
        assertEquals("updated-cover.jpg", result.getCoverImage());

        verify(trackRepository).findById(1L);
        verify(trackRepository).save(existingTrack);
        verify(trackMapper).toDto(existingTrack);
    }

    @Test
    void update_ShouldThrowRuntimeException_WhenInvalidId() {
        when(trackRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            trackService.update(999L, testTrackDto);
        });

        verify(trackRepository).findById(999L);
    }

    @Test
    void updateWithFile_ShouldReturnUpdatedTrackDto_WhenValidId() {
        Track existingTrack = new Track();
        existingTrack.setId(1L);
        existingTrack.setTitle("Old Song");
        existingTrack.setArtist("Old Artist");
        existingTrack.setCategory(MusicCategory.rock);

        TrackDto updateDto = new TrackDto();
        updateDto.setTitle("Updated Song");
        updateDto.setArtist("Updated Artist");
        updateDto.setCategory(MusicCategory.pop);

        when(trackRepository.findById(1L)).thenReturn(Optional.of(existingTrack));
        when(trackRepository.save(existingTrack)).thenReturn(existingTrack);
        when(trackMapper.toDto(existingTrack)).thenReturn(updateDto);

        TrackDto result = trackService.update(1L, updateDto);

        assertNotNull(result);
        assertEquals("Updated Song", result.getTitle());
        assertEquals("Updated Artist", result.getArtist());

        verify(trackRepository).findById(1L);
        verify(trackRepository).save(existingTrack);
        verify(trackMapper).toDto(existingTrack);
    }

    @Test
    void updateWithFile_ShouldHandleNullFile_WhenValidId() {
        Track existingTrack = new Track();
        existingTrack.setId(1L);
        existingTrack.setTitle("Old Song");
        existingTrack.setArtist("Old Artist");

        TrackDto updateDto = new TrackDto();
        updateDto.setTitle("Updated Song");
        updateDto.setArtist("Updated Artist");

        when(trackRepository.findById(1L)).thenReturn(Optional.of(existingTrack));
        when(trackRepository.save(existingTrack)).thenReturn(existingTrack);
        when(trackMapper.toDto(existingTrack)).thenReturn(updateDto);

        TrackDto result = trackService.update(1L, updateDto);

        assertNotNull(result);
        assertEquals("Updated Song", result.getTitle());

        verify(trackRepository).findById(1L);
        verify(trackRepository).save(existingTrack);
        verify(trackMapper).toDto(existingTrack);
    }

    @Test
    void updateWithFile_ShouldThrowRuntimeException_WhenInvalidId() {
        when(trackRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            trackService.update(999L, testTrackDto);
        });

        verify(trackRepository).findById(999L);
    }

    @Test
    void search_ShouldReturnTracksByTitleAndCategory_WhenBothProvided() {
        Pageable pageable = PageRequest.of(0, 8);
        List<Track> tracks = Arrays.asList(testTrack);
        Page<Track> trackPage = new PageImpl<>(tracks, pageable, 1);
        Page<TrackDto> expectedDtoPage = new PageImpl<>(Arrays.asList(testTrackDto), pageable, 1);

        when(trackRepository.findByTitleContainingIgnoreCaseAndCategory("Test", MusicCategory.pop, pageable))
            .thenReturn(trackPage);
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);

        Page<TrackDto> result = trackService.search("Test", MusicCategory.pop, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTrackDto.getTitle(), result.getContent().get(0).getTitle());

        verify(trackRepository).findByTitleContainingIgnoreCaseAndCategory("Test", MusicCategory.pop, pageable);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void search_ShouldReturnTracksByTitle_WhenOnlyTitleProvided() {
        Pageable pageable = PageRequest.of(0, 8);
        List<Track> tracks = Arrays.asList(testTrack);
        Page<Track> trackPage = new PageImpl<>(tracks, pageable, 1);

        when(trackRepository.findByTitleContainingIgnoreCase("Test", pageable))
            .thenReturn(trackPage);
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);

        Page<TrackDto> result = trackService.search("Test", null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTrackDto.getTitle(), result.getContent().get(0).getTitle());

        verify(trackRepository).findByTitleContainingIgnoreCase("Test", pageable);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void search_ShouldReturnTracksByCategory_WhenOnlyCategoryProvided() {
        Pageable pageable = PageRequest.of(0, 8);
        List<Track> tracks = Arrays.asList(testTrack);
        Page<Track> trackPage = new PageImpl<>(tracks, pageable, 1);

        when(trackRepository.findByCategory(MusicCategory.pop, pageable))
            .thenReturn(trackPage);
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);

        Page<TrackDto> result = trackService.search(null, MusicCategory.pop, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTrackDto.getTitle(), result.getContent().get(0).getTitle());

        verify(trackRepository).findByCategory(MusicCategory.pop, pageable);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void search_ShouldReturnAllTracks_WhenNoParametersProvided() {
        Pageable pageable = PageRequest.of(0, 8);
        List<Track> tracks = Arrays.asList(testTrack);
        Page<Track> trackPage = new PageImpl<>(tracks, pageable, 1);

        when(trackRepository.findAll(pageable))
            .thenReturn(trackPage);
        when(trackMapper.toDto(testTrack)).thenReturn(testTrackDto);

        Page<TrackDto> result = trackService.search(null, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(testTrackDto.getTitle(), result.getContent().get(0).getTitle());

        verify(trackRepository).findAll(pageable);
        verify(trackMapper).toDto(testTrack);
    }

    @Test
    void delete_ShouldDeleteTrack_WhenValidId() {
        when(trackRepository.existsById(1L)).thenReturn(true);
        doNothing().when(trackRepository).deleteById(1L);

        trackService.delete(1L);

        verify(trackRepository).existsById(1L);
        verify(trackRepository).deleteById(1L);
    }

    @Test
    void delete_ShouldThrowRuntimeException_WhenInvalidId() {
        when(trackRepository.existsById(999L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            trackService.delete(999L);
        });

        verify(trackRepository).existsById(999L);
    }
}
