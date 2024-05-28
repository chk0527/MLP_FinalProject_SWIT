package com.swit.dto;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String  user_id;
    private String  user_email;
    private String  user_name;
    private String  user_password;
    private String  user_phone;
    private String  user_nick;
    private String  user_sns_connect;
    private String  user_image;
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd hh:mm:ss")
    private LocalDateTime user_create_date;
    private boolean user_delete_chk;
    private Date    user_delete_date;
    
}
