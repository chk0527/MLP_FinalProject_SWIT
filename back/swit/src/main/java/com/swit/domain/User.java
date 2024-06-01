package com.swit.domain;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="user")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)  // Auditing 기능을 포함시킨다!
public class User {
    @Id                                         // 기본 키
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private String  user_id;
    
    private String  user_email;
    private String  user_name;
    private String  user_password;
    private String  user_phone;
    private String  user_nick;
    private String  user_sns_connect;
    private String  user_image;
    
    @CreatedDate                                    // Entity 생성시 일자 자동 저장
    //@Column(updatable = false,nullable = false)   // update 안되게, null 안되게 
    @Column(updatable = false)                      // update 안되게
    private LocalDateTime user_create_date;
    private boolean user_delete_chk;
    private Date    user_delete_date;
}
