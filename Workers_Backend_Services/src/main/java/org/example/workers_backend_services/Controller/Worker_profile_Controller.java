package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Worker_profilerequestDTO;
import org.example.workers_backend_services.DTO.Worker_profileresponseDTO;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Service.Worker_profile_services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class Worker_profile_Controller {

    @Autowired
    Worker_profile_services services;

    @GetMapping
    public ResponseEntity<List<Worker_profileresponseDTO>> getallWorkers(){
        List<Worker_profileresponseDTO> list=services.getallworkers();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker_profileresponseDTO> getWorker(@PathVariable Long id){
        Worker_profileresponseDTO prof=services.getWorker(id);
        if(prof!=null){
            return ResponseEntity.ok(prof);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Worker_profileresponseDTO> addWorker(@Valid @RequestBody Worker_profilerequestDTO profile){
        Worker_profileresponseDTO prof=services.addworker(profile);
        return new ResponseEntity<>(prof, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worker_profileresponseDTO> updateWorker(@PathVariable long id, @Valid @RequestBody Worker_profilerequestDTO profile){
        Worker_profileresponseDTO prof=services.updateWorker(id,profile);
        if(prof!=null){
            return ResponseEntity.ok(prof);
        }
        return ResponseEntity.notFound().build();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorker(@PathVariable long id){
        services.deleteWorker(id);
        return ResponseEntity.ok("worker_profile_not_found");
    }
}
