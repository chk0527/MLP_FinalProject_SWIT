package com.swit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "chatMessage")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studyNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String message;

    public ChatMessage(Long studyNo, String name, String message) {
        this.studyNo = studyNo;
        this.name = name;
        this.message = message;
    }
}