package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Worker_categoryresponseDTO;
import org.example.workers_backend_services.DTO.Worker_profilerequestDTO;
import org.example.workers_backend_services.DTO.Worker_profileresponseDTO;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Repository.UserRepository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class Worker_profile_services {

    @Autowired
    Worker_profileRepository repository;

    @Autowired
    UserRepository userRepository;

    public List<Worker_profileresponseDTO> getallworkers() {
        return repository.findAll().stream()
                .map(this::convert_to_Dto)
                .toList();
    }

    public Worker_profileresponseDTO getWorker(Long id) {
        Worker_profile profile=repository.findById(id).orElseThrow(()->new RuntimeException("worker_profile__not found"));
        return convert_to_Dto(profile);
    }

    public Worker_profileresponseDTO addworker(Worker_profilerequestDTO workerProfilerequestDTO) {
        Users users=userRepository.findById(workerProfilerequestDTO.getUser_id()).orElseThrow(()->new RuntimeException("the user not found "));

        Worker_profile profile=new Worker_profile();
        profile.setUsers(users);
        profile.setExperience_years(workerProfilerequestDTO.getExperience_years());
        profile.setBio(workerProfilerequestDTO.getBio());
        profile.setRating(BigDecimal.ZERO);
        profile.setProfile_image(workerProfilerequestDTO.getProfile_image());
        profile.setCompleted_jobs(0);

        Worker_profile saved=repository.save(profile);
        return convert_to_Dto(saved);
    }

    public Worker_profileresponseDTO updateWorker(Long id, Worker_profilerequestDTO profilerequestDTO) {
        Worker_profile profile=repository.findById(id).orElseThrow(()->new RuntimeException("no profile found"));
        profile.setProfile_image(profilerequestDTO.getProfile_image());;
        profile.setBio(profilerequestDTO.getBio());
        profile.setExperience_years(profilerequestDTO.getExperience_years());

        Worker_profile updated=repository.save(profile);
        return convert_to_Dto(updated);
    }

    public void deleteWorker(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Worker profile not found with id: " + id);
        }
        repository.deleteById(id);
    }


    public Worker_profileresponseDTO convert_to_Dto(Worker_profile profile){
        return new Worker_profileresponseDTO(
                profile.getWorker_id(),
                profile.getExperience_years(),
                profile.getBio(),
                profile.getProfile_image(),
                profile.getRating(),
                profile.getCompleted_jobs(),
                profile.getUsers().getUser_id(),
                profile.getUsers().getUser_name()
        );
    }
}
