package com.example.MusicStream.constructor;


import com.example.MusicStream.dto.TrackDto;
import com.example.MusicStream.entity.MusicCategory;
import com.example.MusicStream.service.TrackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {
    private final TrackService trackService;

    @PostMapping
    public TrackDto create(@RequestBody TrackDto dto)
    {
        return trackService.create(dto);
    }

    @GetMapping
    public Page<TrackDto> search(@RequestParam String title,
                                 @RequestParam MusicCategory category,
                                 @RequestParam int page,
                                 @RequestParam(defaultValue = "8") int size)
    {
        Pageable pageable = PageRequest.of(page,size);
        return trackService.search(title,category,pageable);
    }
}
