package com.swit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsMvcConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        
        corsRegistry.addMapping("/**")
                .allowedOrigins("http://223.130.157.92:15270")
                .allowedOrigins("http://swit.kro.kr:15270");
    }
}