package com.jobtracker.controller;

import com.jobtracker.dto.ApplicationRequest;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.model.User;
import com.jobtracker.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * The logged-in user's own applications.
 * @AuthenticationPrincipal gives us the user that the JWT filter identified.
 *
 *   GET    /api/applications            -> my applications (optional ?status=APPLIED)
 *   GET    /api/applications/{id}       -> one of mine
 *   GET    /api/applications/stats      -> my counts per status
 *   POST   /api/applications            -> create
 *   PUT    /api/applications/{id}       -> update
 *   DELETE /api/applications/{id}       -> delete
 */
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobApplication> getAll(@AuthenticationPrincipal User user,
                                       @RequestParam(required = false) Status status) {
        return service.getAll(user, status);
    }

    @GetMapping("/stats")
    public Map<Status, Long> getStats(@AuthenticationPrincipal User user) {
        return service.getStats(user);
    }

    @GetMapping("/{id}")
    public JobApplication getById(@AuthenticationPrincipal User user, @PathVariable Long id) {
        return service.getById(id, user);
    }

    @PostMapping
    public ResponseEntity<JobApplication> create(@AuthenticationPrincipal User user,
                                                 @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, user));
    }

    @PutMapping("/{id}")
    public JobApplication update(@AuthenticationPrincipal User user,
                                 @PathVariable Long id,
                                 @Valid @RequestBody ApplicationRequest request) {
        return service.update(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        service.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
