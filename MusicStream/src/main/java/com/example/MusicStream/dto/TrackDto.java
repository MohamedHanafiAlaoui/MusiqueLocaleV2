package com.example.MusicStream.dto;

import com.example.MusicStream.entity.MusicCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDto {

    private long  id;
    private String title;
    private String artist;
    private String description;
    private long duration;
    private MusicCategory category;
    private String coverImage ;
    private  double fileSize;
    private String file;
}
