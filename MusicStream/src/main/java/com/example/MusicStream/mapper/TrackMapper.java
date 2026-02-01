package com.example.MusicStream.mapper;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.Track;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TrackMapper {

    TrackDto toDto(Track track);

    Track toEntity(TrackDto dto);
}
