package com.resume.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationDto {
    private Long id;
    private Long applicantId;
    private String applicantName;
    private String applicantEmail;
    private Long jobRoleId;
    private String jobRoleTitle;
    private String resumeFilePath;
    private LocalDateTime appDate;
    private Double aiScore;
    private String extractedSkills;
    private String missingSkills;
    private Double humanScore;
    private String humanFeedback;
}
