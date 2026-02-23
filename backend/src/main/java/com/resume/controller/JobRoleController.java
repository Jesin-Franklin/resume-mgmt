package com.resume.controller;

import com.resume.dto.JobRoleDto;
import com.resume.service.JobRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JobRoleController {

    private final JobRoleService jobRoleService;

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobRoleDto>> getJobsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(jobRoleService.getJobsByCompany(companyId));
    }

    @GetMapping
    public ResponseEntity<List<JobRoleDto>> getAllJobs() {
        return ResponseEntity.ok(jobRoleService.getAllJobs());
    }

    @PostMapping
    public ResponseEntity<JobRoleDto> createJob(@RequestBody JobRoleDto dto) {
        return ResponseEntity.ok(jobRoleService.createJob(dto));
    }
}
