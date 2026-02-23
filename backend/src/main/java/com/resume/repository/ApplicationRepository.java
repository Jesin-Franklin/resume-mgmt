package com.resume.repository;

import com.resume.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobRoleId(Long jobRoleId);

    List<Application> findByApplicantId(Long applicantId);
}
