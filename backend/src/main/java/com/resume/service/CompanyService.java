package com.resume.service;

import com.resume.dto.CompanyDto;
import com.resume.model.Company;
import com.resume.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CompanyDto createCompany(CompanyDto dto) {
        Company company = new Company();
        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    private CompanyDto mapToDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setDescription(company.getDescription());
        return dto;
    }
}
