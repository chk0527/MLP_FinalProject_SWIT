package com.swit.controller.formatter;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.format.Formatter;

public class LocalTimeFormatter implements Formatter<LocalTime> {
    //@SuppressWarnings("null")
    @Override
    public LocalTime parse(String text, Locale locale){
        return LocalTime.parse(text, DateTimeFormatter.ofPattern("HH:mm:ss"));
    }

    //@SuppressWarnings("null")
    @Override
    public String print(LocalTime object, Locale locale) {
        return DateTimeFormatter.ofPattern("HH:mm:ss").format(object);
    }
}

