package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;
import org.example.workers_backend_services.Entity.*;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.example.workers_backend_services.Repository.Service_Request_Repository;
import org.example.workers_backend_services.Repository.UserRepository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class Service_Request_Services implements Service_Request_interface {

    @Autowired
    Service_Request_Repository repository;
    @Autowired
    CategoryRepository catrepo;
    @Autowired
    UserRepository userrepo;
    @Autowired
    Worker_profileRepository workerProfileRepository;

    @Override
    public Service_requestResponseDTO createServiceRequest(Service_requestRequestDTO dto) {
        Users customer = userrepo.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));
        Category category = catrepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        Service_request request = new Service_request();
        request.setCustomer(customer);
        request.setCategory(category);
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setAddress(dto.getAddress());
        request.setPreferredDate(dto.getPreferredDate());
        request.setPreferredTime(dto.getPreferredTime());
        request.setStatus(ServiceStatus.OPEN);   // server-controlled, always starts here
        request.setCreatedAt(LocalDateTime.now());
        // worker intentionally left null — assigned separately

        Service_request saved = repository.save(request);
        return convertDto(saved);

    }

    @Override
    public List<Service_requestResponseDTO> getAllServiceRequests() {
        return repository.findAll().stream()
                .map(this::convertDto)
                .toList();
    }

    @Override
    public Service_requestResponseDTO getServiceRequestById(Long id) {
        Service_request req= repository.findById(id).orElseThrow(()->new RuntimeException("Service request not found"));
        return convertDto(req);
    }
    @Override
    public Service_requestResponseDTO updateServiceRequest(Long id, Service_requestRequestDTO Dto) {
        Service_request existingrequest=repository.findById(id)
                .orElseThrow(()->new RuntimeException("No service request found"));
        Category category=catrepo.findById(id).orElseThrow(()->new RuntimeException("No category found"));

        existingrequest.setCategory(category);
        existingrequest.setTitle(Dto.getTitle());
        existingrequest.setDescription(Dto.getDescription());
        existingrequest.setAddress(Dto.getAddress());
        existingrequest.setPreferredDate(Dto.getPreferredDate());
        existingrequest.setPreferredTime(Dto.getPreferredTime());

        Service_request updated = repository.save(existingrequest);
        return convertDto(updated);
    }

    @Override
    public boolean deleteServiceRequest(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    private Service_requestResponseDTO convertDto(Service_request serviceRequest){
        return new Service_requestResponseDTO(
                serviceRequest.getService_id(),
                serviceRequest.getCustomer().getUser_id(),
                serviceRequest.getCustomer().getUser_name(),
                serviceRequest.getWorker().getWorker_id(),
                serviceRequest.getWorker().getUsers().getUser_name(),
                serviceRequest.getCategory().getCat_id(),
                serviceRequest.getCategory().getCat_name(),
                serviceRequest.getTitle(),
                serviceRequest.getDescription(),
                serviceRequest.getAddress(),
                serviceRequest.getPreferredDate(),
                serviceRequest.getPreferredTime(),
                serviceRequest.getStatus().toString(),
                serviceRequest.getCreatedAt()
        );
    }

    public Service_requestResponseDTO assignWorker(Long id, Long workerId) {
        Service_request existingrequest=repository.findById(id).orElseThrow(()->new RuntimeException("Service request not found with id "+id));
        Worker_profile profile=workerProfileRepository.findById(id).orElseThrow(()->new RuntimeException("Worker not found radha"));

        existingrequest.setWorker(profile);
        existingrequest.setStatus(ServiceStatus.OPEN.equals(existingrequest.getStatus())?ServiceStatus.ASSIGNED:existingrequest.getStatus());
        Service_request updated = repository.save(existingrequest);
        return convertDto(updated);
    }
}
