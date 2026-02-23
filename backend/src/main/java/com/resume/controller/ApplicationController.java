package com.resume.controller;

import com.resume.dto.ApplicationDto;
import com.resume.dto.ScreeningFeedbackDto;
import com.resume.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/upload")
    public ResponseEntity<ApplicationDto> uploadResume(
            @RequestParam("applicantId") Long applicantId,
            @RequestParam("jobRoleId") Long jobRoleId,
            @RequestParam("resume") MultipartFile resumeFile) {
        try {
            ApplicationDto result = applicationService.submitApplication(applicantId, jobRoleId, resumeFile);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/job/{jobRoleId}")
    public ResponseEntity<List<ApplicationDto>> getApplicationsForJob(@PathVariable Long jobRoleId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobRoleId));
    }

    @PostMapping("/{applicationId}/feedback")
    public ResponseEntity<ApplicationDto> submitFeedback(
            @PathVariable Long applicationId,
            @RequestBody ScreeningFeedbackDto feedback) {
        return ResponseEntity.ok(applicationService.submitHumanFeedback(applicationId, feedback));
    }
}
