package com.resume.service;

import com.resume.dto.ApplicationDto;
import com.resume.dto.ScreeningFeedbackDto;
import com.resume.model.Application;
import com.resume.model.JobRole;
import com.resume.model.ScreeningScore;
import com.resume.model.User;
import com.resume.repository.ApplicationRepository;
import com.resume.repository.JobRoleRepository;
import com.resume.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRoleRepository jobRoleRepository;
    private final UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    public ApplicationDto submitApplication(Long applicantId, Long jobRoleId, MultipartFile resumeFile)
            throws IOException {
        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new RuntimeException("Applicant not found"));
        JobRole jobRole = jobRoleRepository.findById(jobRoleId)
                .orElseThrow(() -> new RuntimeException("Job Role not found"));

        // Save file locally
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        String fileName = System.currentTimeMillis() + "_" + resumeFile.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, resumeFile.getBytes());

        // Simple mock parsing (Normally you'd use Tika or PDFBox here)
        String mockParsedText = "Mocked parsed content of " + resumeFile.getOriginalFilename()
                + ". Contains some words.";

        Application app = new Application();
        app.setApplicant(applicant);
        app.setJobRole(jobRole);
        app.setResumeFilePath(filePath.toString());
        app.setParsedResumeText(mockParsedText);

        // Perform Mock AI Screening
        ScreeningScore score = performMockAIScreening(app, jobRole);
        app.setScreeningScore(score);
        score.setApplication(app);

        Application saved = applicationRepository.save(app);
        return mapToDto(saved);
    }

    public List<ApplicationDto> getApplicationsForJob(Long jobRoleId) {
        return applicationRepository.findByJobRoleId(jobRoleId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ApplicationDto submitHumanFeedback(Long applicationId, ScreeningFeedbackDto feedbackDto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        ScreeningScore score = app.getScreeningScore();
        if (score != null) {
            score.setHumanScore(feedbackDto.getHumanScore());
            score.setHumanFeedback(feedbackDto.getHumanFeedback());
            applicationRepository.save(app);
        }
        return mapToDto(app);
    }

    private ScreeningScore performMockAIScreening(Application app, JobRole job) {
        ScreeningScore score = new ScreeningScore();
        // Mock logic: generate a random score between 50 and 95
        double randomAiScore = 50 + (Math.random() * 45);
        score.setAiScore(Math.round(randomAiScore * 10.0) / 10.0);

        // Mock extracted skills
        String skills = job.getRequiredSkills() != null ? job.getRequiredSkills() : "Java, React";
        score.setExtractedSkills("Mocked matched skills based on job requirements: " + skills);

        return score;
    }

    private ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setApplicantId(app.getApplicant().getId());
        dto.setApplicantName(app.getApplicant().getName());
        dto.setApplicantEmail(app.getApplicant().getEmail());
        dto.setJobRoleId(app.getJobRole().getId());
        dto.setJobRoleTitle(app.getJobRole().getTitle());
        dto.setResumeFilePath(app.getResumeFilePath());
        dto.setAppDate(app.getAppDate());

        if (app.getScreeningScore() != null) {
            dto.setAiScore(app.getScreeningScore().getAiScore());
            dto.setExtractedSkills(app.getScreeningScore().getExtractedSkills());
            dto.setHumanScore(app.getScreeningScore().getHumanScore());
            dto.setHumanFeedback(app.getScreeningScore().getHumanFeedback());
        }
        return dto;
    }
}
