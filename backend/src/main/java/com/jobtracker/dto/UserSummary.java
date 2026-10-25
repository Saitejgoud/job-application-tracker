package com.jobtracker.dto;

/** Admin view of a user (no password). */
public record UserSummary(Long id, String name, String email, String role, long applicationCount) { }
