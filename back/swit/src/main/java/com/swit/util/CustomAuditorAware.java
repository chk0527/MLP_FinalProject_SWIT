package com.swit.util;

import org.springframework.data.domain.AuditorAware;
import java.time.LocalDateTime;
import java.util.Optional;

public class CustomAuditorAware implements AuditorAware<LocalDateTime> {
    private boolean addFiveMinutes;

    public CustomAuditorAware(boolean addFiveMinutes) {
        this.addFiveMinutes = addFiveMinutes;
    }

    @Override
    public Optional<LocalDateTime> getCurrentAuditor() {
        LocalDateTime now = LocalDateTime.now();
        if (addFiveMinutes) {
            // 시스템 시간에 5분 추가
            now = now.plusMinutes(5);
        }
        return Optional.of(now);
    }

    public void setAddFiveMinutes(boolean addFiveMinutes) {
        this.addFiveMinutes = addFiveMinutes;
    }

}