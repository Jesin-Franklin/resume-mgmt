package com.resume.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_role_id", nullable = false)
    private JobRole jobRole;

    @Column(nullable = false)
    private String resumeFilePath;

    @Column(columnDefinition = "TEXT")
    private String parsedResumeText;

    private LocalDateTime appDate = LocalDateTime.now();

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL)
    private ScreeningScore screeningScore;
}
