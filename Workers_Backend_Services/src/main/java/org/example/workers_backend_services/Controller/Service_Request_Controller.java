package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;
import org.example.workers_backend_services.Entity.Service_request;
import org.example.workers_backend_services.Service.Service_Request_Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service_request")
public class Service_Request_Controller {
    @Autowired
    Service_Request_Services services;

    @PostMapping
    public ResponseEntity<Service_requestResponseDTO> createRequest( @Valid @RequestBody Service_requestRequestDTO dto) {
        Service_requestResponseDTO createdRequest = services.createServiceRequest(dto);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    // 2. Get all service requests
    @GetMapping
    public ResponseEntity<List<Service_requestResponseDTO>> getAllRequests() {
        List<Service_requestResponseDTO> requests = services.getAllServiceRequests();
        return ResponseEntity.ok(requests);
    }

    // 3. Get a specific service request by ID
    @GetMapping("/{id}")
    public ResponseEntity<Service_requestResponseDTO> getRequestById(@Valid @PathVariable("id") Long id) {
        Service_requestResponseDTO request = services.getServiceRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        }
        return ResponseEntity.notFound().build();
    }

    // 4. Update an existing service request
    @PutMapping("/{id}")
    public ResponseEntity<Service_requestResponseDTO> updateRequest(@Valid @PathVariable("id") Long id, @RequestBody Service_requestRequestDTO dto) {
        Service_requestResponseDTO updatedRequest = services.updateServiceRequest(id, dto);
       return ResponseEntity.ok(updatedRequest);
    }

    @PutMapping("/{id}/assign-worker/{workerId}")
    public ResponseEntity<Service_requestResponseDTO> assignWorker(@PathVariable("id") Long id,@PathVariable("workerId") Long workerId){
        Service_requestResponseDTO updatedrequest=services.assignWorker(id,workerId);
        return ResponseEntity.ok(updatedrequest);
    }

    // 5. Delete a service request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable("id") Long id) {
        boolean deleted = services.deleteServiceRequest(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
