package com.example.MusicStream.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded music files
        registry.addResourceHandler("/uploads/music/**")
                .addResourceLocations("file:uploads/music/");
        
        // Serve uploaded cover images
        registry.addResourceHandler("/uploads/covers/**")
                .addResourceLocations("file:uploads/covers/");
    }
}
