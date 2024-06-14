package com.swit.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inquiry")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer inquiryNo;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "study_no", nullable = false)
    private Study study;

    @Column(name = "inquiry_content", nullable = false, length = 200)
    private String inquiryContent;

    @Column(name = "inquiry_time", nullable = false)
    private LocalDateTime inquiryTime;

    @Column(name = "inquiry_type", nullable = false, length = 1)
    private String inquiryType;

    @Column(name = "response_content", length = 200)
    private String responseContent;

    @PrePersist
    protected void onCreate() {
        this.inquiryTime = LocalDateTime.now();
    }
}
