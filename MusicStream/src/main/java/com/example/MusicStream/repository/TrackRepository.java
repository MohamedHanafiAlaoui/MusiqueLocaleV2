package com.example.MusicStream.repository;

import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackRepository extends JpaRepository<Track,Long> {
    List<Track> findByArtist(String artist);

    List<Track> findByCategory(MusicCategory category);

    List<Track> findByTitleContainingIgnoreCase(String title);

}
