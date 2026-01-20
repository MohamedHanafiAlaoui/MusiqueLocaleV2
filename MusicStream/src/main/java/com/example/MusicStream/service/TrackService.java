package com.example.MusicStream.service;

public interface TrackService {
    TrackDto create(TrackDto dto);
    List<TrackDto> getAll();
    TrackDto getById(Long id);
    void delete(Long id);
}