package com.swit.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JoinDTO {
    private String userId;
    private String userName;
    private String userPassword;
    private Boolean userDeleteChk;
    private String userRole;

}
