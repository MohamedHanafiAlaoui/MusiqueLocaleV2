package com.example.MusicStream.dto;

import com.example.MusicStream.entity.MusicCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDto {

    private Long id;
    private String title;
    private String artist;
    private String description;
    private Long duration;
    private MusicCategory category;
    private Long fileSize;
    private String fileUrl;
    private String coverImage;
}
