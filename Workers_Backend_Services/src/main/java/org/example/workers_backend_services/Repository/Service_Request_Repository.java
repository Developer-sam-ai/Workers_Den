package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Service_request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Service_Request_Repository extends JpaRepository<Service_request,Long> {

}
