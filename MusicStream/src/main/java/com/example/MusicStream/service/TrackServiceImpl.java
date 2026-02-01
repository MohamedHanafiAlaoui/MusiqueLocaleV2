package com.example.MusicStream.service;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.entity.Track;
import com.example.MusicStream.mapper.TrackMapper;
import com.example.MusicStream.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService {

    private final TrackRepository trackRepository;
    private final TrackMapper trackMapper;

    private final String UPLOAD_DIR = "uploads/music";

    private String saveFile(MultipartFile file) throws IOException {
        Path dir = Paths.get(UPLOAD_DIR);
        if (!Files.exists(dir)) Files.createDirectories(dir);

        String ext = file.getOriginalFilename()
                .substring(file.getOriginalFilename().lastIndexOf("."));

        String name = UUID.randomUUID() + ext;

        Path path = dir.resolve(name);
        Files.copy(file.getInputStream(), path);

        return ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/uploads/music/")
                .path(name)
                .toUriString();
    }

    @Override
    public TrackDto create(TrackDto dto) {
        return trackMapper.toDto(trackRepository.save(trackMapper.toEntity(dto)));
    }

    @Override
    public TrackDto createWithFile(TrackDto dto, MultipartFile file) {
        try {
            dto.setFileUrl(saveFile(file));
            dto.setFileSize(file.getSize());
            return trackMapper.toDto(trackRepository.save(trackMapper.toEntity(dto)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public TrackDto show(long id) {
        return trackMapper.toDto(trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track not found with id: " + id)));
    }

    @Override
    public TrackDto update(long id, TrackDto dto) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track not found with id: " + id));
        
        track.setTitle(dto.getTitle());
        track.setArtist(dto.getArtist());
        track.setDescription(dto.getDescription());
        track.setCategory(dto.getCategory());
        track.setDuration(dto.getDuration());
        track.setCoverImage(dto.getCoverImage());
        
        return trackMapper.toDto(trackRepository.save(track));
    }

    @Override
    public TrackDto updateWithFile(long id, TrackDto dto, MultipartFile file) {
        Track track = trackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Track not found with id: " + id));

        track.setTitle(dto.getTitle());
        track.setArtist(dto.getArtist());
        track.setCategory(dto.getCategory());
        track.setDescription(dto.getDescription());
        track.setDuration(dto.getDuration());
        track.setCoverImage(dto.getCoverImage());

        try {
            if (file != null && !file.isEmpty()) {
                track.setFileUrl(saveFile(file));
                track.setFileSize(file.getSize());
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return trackMapper.toDto(trackRepository.save(track));
    }

    @Override
    public Page<TrackDto> search(String title, MusicCategory category, Pageable pageable) {
        if (title != null && category != null) {
            return trackRepository.findByTitleContainingIgnoreCaseAndCategory(title, category, pageable)
                    .map(trackMapper::toDto);
        } else if (title != null) {
            return trackRepository.findByTitleContainingIgnoreCase(title, pageable)
                    .map(trackMapper::toDto);
        } else if (category != null) {
            return trackRepository.findByCategory(category, pageable)
                    .map(trackMapper::toDto);
        } else {
            return trackRepository.findAll(pageable)
                    .map(trackMapper::toDto);
        }
    }

    @Override
    public void delete(long id) {
        if (!trackRepository.existsById(id)) {
            throw new RuntimeException("Track not found with id: " + id);
        }
        trackRepository.deleteById(id);
    }
}
