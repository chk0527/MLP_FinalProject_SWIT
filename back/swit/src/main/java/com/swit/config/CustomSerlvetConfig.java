package com.swit.config;

import org.modelmapper.AbstractConverter;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.swit.controller.formatter.LocalDateTimeFormatter;

@Configuration
public class CustomSerlvetConfig implements WebMvcConfigurer {
    // @SuppressWarnings("null")
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatter(new LocalDateTimeFormatter());
    }

    // @SuppressWarnings("null")
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .maxAge(300)
                .allowedHeaders("Authorization", "Cache-Control", "Content-Type");
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return mapper;
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        Converter<Integer, Boolean> integerToBooleanConverter = new AbstractConverter<Integer, Boolean>() {
            @Override
            protected Boolean convert(Integer source) {
                return source != null && source == 1;
            }
        };
        modelMapper.addConverter(integerToBooleanConverter);
        return modelMapper;
    }
}
