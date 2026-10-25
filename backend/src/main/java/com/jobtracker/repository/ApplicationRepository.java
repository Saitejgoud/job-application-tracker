package com.jobtracker.repository;

import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {

    // ----- queries scoped to one user -----
    List<JobApplication> findByUserOrderByAppliedDateDesc(User user);

    List<JobApplication> findByUserAndStatusOrderByAppliedDateDesc(User user, Status status);

    Optional<JobApplication> findByIdAndUser(Long id, User user);

    long countByUserAndStatus(User user, Status status);

    long countByUser(User user);

    // ----- queries for the admin (all users) -----
    List<JobApplication> findAllByOrderByAppliedDateDesc();

    long countByStatus(Status status);
}
