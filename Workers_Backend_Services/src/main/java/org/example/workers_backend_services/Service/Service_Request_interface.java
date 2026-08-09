package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;
import org.example.workers_backend_services.Entity.Service_request;

import java.util.List;

public interface Service_Request_interface {
    Service_requestResponseDTO createServiceRequest(Service_requestRequestDTO serviceRequest);

    List<Service_requestResponseDTO> getAllServiceRequests();

    Service_requestResponseDTO getServiceRequestById(Long id);

    Service_requestResponseDTO updateServiceRequest(Long id, Service_requestRequestDTO updatedData);

    Service_requestResponseDTO  assignWorker(Long id, Long workerId);

    boolean deleteServiceRequest(Long id);
}
