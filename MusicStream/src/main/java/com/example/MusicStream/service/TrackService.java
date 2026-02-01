package com.example.MusicStream.service;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface TrackService {

    TrackDto create(TrackDto dto);

    TrackDto createWithFile(TrackDto dto, MultipartFile file);

    TrackDto show(long id);

    TrackDto updateWithFile(long id, TrackDto dto, MultipartFile file);

    Page<TrackDto> search(String title, MusicCategory category, Pageable pageable);

    TrackDto update(long id, TrackDto dto);

    void delete(long id);
}
