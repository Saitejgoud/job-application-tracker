package com.jobtracker.dto;

/** What the client receives after a successful login or registration. */
public record AuthResponse(String token, String name, String email, String role) { }
