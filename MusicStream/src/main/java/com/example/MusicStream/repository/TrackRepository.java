package com.example.MusicStream.repository;

import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.entity.Track;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface TrackRepository extends JpaRepository<Track,Long> {


    Page<Track> findByTitleContainingIgnoreCaseAndCategory(String title, MusicCategory musicCategory, Pageable pageable);

}
