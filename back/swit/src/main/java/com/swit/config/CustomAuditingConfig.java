package com.swit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;

import com.swit.util.CustomAuditorAware;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "customAuditorAware")
public class CustomAuditingConfig {
    @Bean
    public CustomAuditorAware customAuditorAware() {
        // 시스템 시간에 5분 추가 여부 설정
        System.out.println("CustomAuditorAware() in");
        return new CustomAuditorAware(true);
    }

    // @Bean
    // public CustomAuditorAware customAuditorAware(boolean addFiveMinutes) {
    //     // 시스템 시간에 5분 추가 여부 설정
    //     System.out.println("CustomAuditorAware(boolean) in");
    //     return new CustomAuditorAware(addFiveMinutes);
    // }
}