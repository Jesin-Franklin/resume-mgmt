package com.resume.dto;

import lombok.Data;

@Data
public class JobRoleDto {
    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private Long companyId;
    private String companyName;
}
