package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Reviews_Request_Repository extends JpaRepository<Reviews,Long> {
}
