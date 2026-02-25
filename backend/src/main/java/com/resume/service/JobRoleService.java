package com.resume.service;

import com.resume.dto.JobRoleDto;
import com.resume.model.Company;
import com.resume.model.JobRole;
import com.resume.repository.CompanyRepository;
import com.resume.repository.JobRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobRoleService {

    private final JobRoleRepository jobRoleRepository;
    private final CompanyRepository companyRepository;

    public List<JobRoleDto> getJobsByCompany(Long companyId) {
        return jobRoleRepository.findByCompanyId(companyId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<JobRoleDto> getAllJobs() {
        return jobRoleRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public JobRoleDto createJob(JobRoleDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        JobRole job = new JobRole();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequiredSkills(dto.getRequiredSkills());
        job.setCompany(company);

        JobRole saved = jobRoleRepository.save(job);
        return mapToDto(saved);
    }

    private JobRoleDto mapToDto(JobRole job) {
        JobRoleDto dto = new JobRoleDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        return dto;
    }
}
