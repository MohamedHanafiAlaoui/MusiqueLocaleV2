package com.example.MusicStream.service;


import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.entity.Track;
import com.example.MusicStream.mapper.TrackMapper;
import com.example.MusicStream.repository.TrackRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrackServiceImpl implements TrackService{
 private final TrackRepository trackRepository;
 private final TrackMapper trackMapper;


 @Override
   public TrackDto create(TrackDto dto) {
     Track track = trackMapper.toEntity(dto);


     return trackMapper.toDto(trackRepository.save(track));
 }

 @Override
 public Page<TrackDto> search(String title, MusicCategory category,Pageable pageable)
 {
    return  trackRepository.findByTitleContainingIgnoreCaseAndCategory(title,category,pageable)
            .map(trackMapper::toDto);
 }


}
