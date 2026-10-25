package com.jobtracker.service;

import com.jobtracker.dto.UserSummary;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.repository.ApplicationRepository;
import com.jobtracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/** Read-only views across all users, for the ADMIN role. */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public AdminService(UserRepository userRepository, ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<UserSummary> getUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummary(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().name(),
                        applicationRepository.countByUser(u)))
                .toList();
    }

    public List<JobApplication> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedDateDesc();
    }

    public Map<Status, Long> getStats() {
        Map<Status, Long> stats = new EnumMap<>(Status.class);
        for (Status s : Status.values()) {
            stats.put(s, applicationRepository.countByStatus(s));
        }
        return stats;
    }
}
