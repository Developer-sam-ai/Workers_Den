package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Worker_category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Worker_category_Repository extends JpaRepository<Worker_category,Long> {


}
