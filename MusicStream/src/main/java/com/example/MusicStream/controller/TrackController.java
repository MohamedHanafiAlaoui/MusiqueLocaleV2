package com.example.MusicStream.controller;

import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.service.TrackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
@Tag(name = "Tracks", description = "Manage all tracks")
@CrossOrigin(origins = "http://localhost:4200",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST,
                RequestMethod.PUT, RequestMethod.DELETE,
                RequestMethod.OPTIONS})
public class TrackController {

    private final TrackService trackService;

    @Operation(summary = "Create a new track")
    @PostMapping(consumes = "multipart/form-data")
    public TrackDto create(@RequestPart("title") String title,
                          @RequestPart("artist") String artist,
                          @RequestPart("category") String category,
                          @RequestPart(value = "description", required = false) String description,
                          @RequestPart(value = "duration", required = false) String duration,
                          @RequestPart(value = "coverImage", required = false) String coverImage,
                          @RequestPart("file") MultipartFile file) {
        if (description == null) description = "";
        if (duration == null) duration = "0";
        
        TrackDto dto = new TrackDto();
        dto.setTitle(title);
        dto.setArtist(artist);
        dto.setCategory(MusicCategory.valueOf(category));
        dto.setDescription(description);
        dto.setDuration(Long.parseLong(duration));
        dto.setCoverImage(coverImage);
        
        return trackService.createWithFile(dto, file);
    }

    @Operation(summary = "Search tracks by title and category")
    @GetMapping
    public Page<TrackDto> search(@RequestParam(required = false) String title,
                                 @RequestParam(required = false) MusicCategory category,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "8") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return trackService.search(title, category, pageable);
    }

    @Operation(summary = "Get track by ID")
    @GetMapping("/{id}")
    public TrackDto show(@PathVariable long id) {
        return trackService.show(id);
    }

    @Operation(summary = "Update track")
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public TrackDto update(
            @PathVariable long id,
            @RequestPart("title") String title,
            @RequestPart("artist") String artist,
            @RequestPart("category") String category,
            @RequestPart(value = "description", required = false) String description,
            @RequestPart(value = "duration", required = false) String duration,
            @RequestPart(value = "coverImage", required = false) String coverImage,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        if (description == null) description = "";
        if (duration == null) duration = "0";

        TrackDto dto = new TrackDto();
        dto.setTitle(title);
        dto.setArtist(artist);
        dto.setCategory(MusicCategory.valueOf(category));
        dto.setDescription(description);
        dto.setDuration(Long.parseLong(duration));
        dto.setCoverImage(coverImage);

        return trackService.updateWithFile(id, dto, file);
    }

    @Operation(summary = "Delete track by ID")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        trackService.delete(id);
    }
}
