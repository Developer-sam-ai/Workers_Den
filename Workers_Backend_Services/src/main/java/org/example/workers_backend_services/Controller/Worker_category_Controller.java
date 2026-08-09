package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Worker_categoryrequestDTO;
import org.example.workers_backend_services.DTO.Worker_categoryresponseDTO;
import org.example.workers_backend_services.Entity.Worker_category;
import org.example.workers_backend_services.Service.Worker_category_Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/workercategory")
public class Worker_category_Controller {

    @Autowired
    Worker_category_Services services;

    @PostMapping
    public ResponseEntity<Worker_categoryresponseDTO> createWorkerCategory(@Valid  @RequestBody Worker_categoryrequestDTO dto) {
        Worker_categoryresponseDTO workerCategoryresponseDTO=services.createWorkerCategory(dto);
        return new ResponseEntity<>(workerCategoryresponseDTO,HttpStatus.CREATED);
    }

    // READ (ALL)
    @GetMapping
    public ResponseEntity<List<Worker_categoryresponseDTO>> getallworkercat() {
        List<Worker_categoryresponseDTO> categories = services.getAllWorkerCategories();
        return ResponseEntity.ok(categories); // Returns HTTP 200
    }

    // READ (BY ID)
    @GetMapping("/{id}")
    public ResponseEntity<Worker_categoryresponseDTO> getWorkerCategoryById(@PathVariable Long id) {
        Worker_categoryresponseDTO category = services.getWorkerCategoryById(id);
            return ResponseEntity.ok(category);

    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Worker_categoryresponseDTO> updateWorkerCategory(@PathVariable Long id,@Valid @RequestBody Worker_categoryrequestDTO categoryDetails) {
        Worker_categoryresponseDTO updatedCategory = services.updateWorkerCategory(id, categoryDetails);
            return ResponseEntity.ok(updatedCategory);

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkerCategory(@PathVariable Long id) {
        boolean deleted = services.deleteWorkerCategory(id);
        if (deleted) {
            return ResponseEntity.ok("Worker category deleted successfully.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Worker category not found with id: " + id);
    }
}
