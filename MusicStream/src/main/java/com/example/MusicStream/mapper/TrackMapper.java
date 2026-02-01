package com.example.MusicStream.mapper;


import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.Track;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TrackMapper {
    TrackMapper INSTANCE = Mappers.getMapper(TrackMapper.class);

    TrackDto toDto(Track track);

    Track toEntity(TrackDto dto);
}
