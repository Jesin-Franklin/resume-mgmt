package com.resume.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "screening_scores")
@Data
@NoArgsConstructor
public class ScreeningScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    // The AI generated heuristic score
    private Double aiScore;

    @Column(columnDefinition = "TEXT")
    private String extractedSkills;

    // Human-in-the-loop review
    private Double humanScore;

    @Column(columnDefinition = "TEXT")
    private String humanFeedback;

    private LocalDateTime scoredAt = LocalDateTime.now();
}
