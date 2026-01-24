package com.example.MusicStream.service;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;



public interface TrackService {
    TrackDto create(TrackDto dto);

    Page<TrackDto> search(String title, MusicCategory category, Pageable pageable);
}