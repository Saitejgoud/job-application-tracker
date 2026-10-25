package com.jobtracker.controller;

import com.jobtracker.dto.UserSummary;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.service.AdminService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * ADMIN only (enforced in SecurityConfig).
 *
 *   GET /api/admin/users          -> all users with their application counts
 *   GET /api/admin/applications   -> every user's applications
 *   GET /api/admin/stats          -> counts per status across all users
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<UserSummary> users() {
        return adminService.getUsers();
    }

    @GetMapping("/applications")
    public List<JobApplication> applications() {
        return adminService.getAllApplications();
    }

    @GetMapping("/stats")
    public Map<Status, Long> stats() {
        return adminService.getStats();
    }
}
