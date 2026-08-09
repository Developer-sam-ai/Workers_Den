package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Worker_profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Worker_profileRepository extends JpaRepository<Worker_profile,Long> {
}
