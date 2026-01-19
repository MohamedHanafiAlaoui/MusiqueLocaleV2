package com.example.MusicStream.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "tracks")
@Getter
@Setter
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long  id;
    private String title;
    private String artist;
    @Column(length = 200)

    private String description;
    private long duration;
    @Enumerated(EnumType.STRING)
    private MusicCategory category;
    private String coverImage ;
    private  double fileSize;
    private String file;

}
