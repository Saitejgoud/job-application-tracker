package com.jobtracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * One row in "job_applications". Each application belongs to one user
 * (many applications -> one user).
 */
@Entity
@Table(name = "job_applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String company;

    @Column(name = "role_title", nullable = false)
    private String roleTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    @Column(length = 500)
    private String notes;

    @Column(name = "job_link", length = 300)
    private String jobLink;

    // The owner. Not sent as a nested object in JSON (see getOwnerEmail below).
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    public JobApplication() { }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @JsonProperty("ownerEmail")
    public String getOwnerEmail() {
        return user != null ? user.getEmail() : null;
    }

    @JsonProperty("ownerName")
    public String getOwnerName() {
        return user != null ? user.getName() : null;
    }
}
