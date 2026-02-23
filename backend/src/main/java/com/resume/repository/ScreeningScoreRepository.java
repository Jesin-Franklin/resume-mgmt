package com.resume.repository;

import com.resume.model.ScreeningScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningScoreRepository extends JpaRepository<ScreeningScore, Long> {
}
