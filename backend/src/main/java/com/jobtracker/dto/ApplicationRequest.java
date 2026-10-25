package com.jobtracker.dto;

import com.jobtracker.model.Status;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTO (Data Transfer Object) = the shape of data the client sends us.
 * Validation annotations reject bad input before it reaches the database.
 */
public class ApplicationRequest {

    @NotBlank(message = "Company is required")
    @Size(max = 100, message = "Company must be at most 100 characters")
    private String company;

    @NotBlank(message = "Role is required")
    @Size(max = 100, message = "Role must be at most 100 characters")
    private String roleTitle;

    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "Applied date is required")
    @PastOrPresent(message = "Applied date cannot be in the future")
    private LocalDate appliedDate;

    @Size(max = 500, message = "Notes must be at most 500 characters")
    private String notes;

    @Size(max = 300, message = "Job link must be at most 300 characters")
    private String jobLink;

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getJobLink() { return jobLink; }
    public void setJobLink(String jobLink) { this.jobLink = jobLink; }
}
