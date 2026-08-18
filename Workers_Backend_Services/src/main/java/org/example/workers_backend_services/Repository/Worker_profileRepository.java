package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Worker_profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Worker_profileRepository extends JpaRepository<Worker_profile, Long> {
    Optional<Worker_profile> findByUser_Email(String email);
    Optional<Worker_profile> findByUser_Id(Long userId);
    List<Worker_profile> findByLocalityAndIsAvailableTrue(String locality);
}