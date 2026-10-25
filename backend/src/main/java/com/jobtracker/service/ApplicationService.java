package com.jobtracker.service;

import com.jobtracker.dto.ApplicationRequest;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.model.User;
import com.jobtracker.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Business logic for a normal user's own applications.
 * Every method takes the logged-in user, so a user can only touch their own data.
 */
@Service
public class ApplicationService {

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> getAll(User user, Status status) {
        if (status == null) {
            return repository.findByUserOrderByAppliedDateDesc(user);
        }
        return repository.findByUserAndStatusOrderByAppliedDateDesc(user, status);
    }

    public JobApplication getById(Long id, User user) {
        // Someone else's application looks exactly like a missing one (404)
        return repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id " + id));
    }

    public JobApplication create(ApplicationRequest request, User user) {
        JobApplication app = new JobApplication();
        copyFields(request, app);
        app.setUser(user);
        return repository.save(app);
    }

    public JobApplication update(Long id, ApplicationRequest request, User user) {
        JobApplication app = getById(id, user);
        copyFields(request, app);
        return repository.save(app);
    }

    public void delete(Long id, User user) {
        JobApplication app = getById(id, user);
        repository.delete(app);
    }

    public Map<Status, Long> getStats(User user) {
        Map<Status, Long> stats = new EnumMap<>(Status.class);
        for (Status s : Status.values()) {
            stats.put(s, repository.countByUserAndStatus(user, s));
        }
        return stats;
    }

    private void copyFields(ApplicationRequest request, JobApplication app) {
        app.setCompany(request.getCompany().trim());
        app.setRoleTitle(request.getRoleTitle().trim());
        app.setStatus(request.getStatus());
        app.setAppliedDate(request.getAppliedDate());
        app.setNotes(request.getNotes());
        app.setJobLink(request.getJobLink());
    }
}
