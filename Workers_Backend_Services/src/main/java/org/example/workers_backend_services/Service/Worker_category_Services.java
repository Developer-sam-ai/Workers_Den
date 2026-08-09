package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Worker_categoryrequestDTO;
import org.example.workers_backend_services.DTO.Worker_categoryresponseDTO;
import org.example.workers_backend_services.Entity.Category;
import org.example.workers_backend_services.Entity.Worker_category;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.example.workers_backend_services.Repository.Worker_category_Repository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Worker_category_Services {

    @Autowired
    Worker_category_Repository categoryRepository;
    @Autowired
    Worker_profileRepository workerRepo;
    @Autowired
    CategoryRepository catRepo;

    public Worker_categoryresponseDTO createWorkerCategory(Worker_categoryrequestDTO dto) {
        if(dto.getMax_price()<dto.getMin_price()){
            throw new RuntimeException("max price cannot be less than min price");
        }

        Worker_profile workerProfile=workerRepo.findById(dto.getWorker_id()).orElseThrow(()->new RuntimeException("Worker not found with id"+dto.getWorker_id()));
        Category category=catRepo.findById(dto.getCat_id()).orElseThrow(()->new RuntimeException("Category not found with id: "));

        Worker_category workerCategory=new Worker_category();
        workerCategory.setMin_price(dto.getMin_price());
        workerCategory.setMax_price(dto.getMax_price());
        workerCategory.setWorker(workerProfile);
        workerCategory.setCategory(category);

        Worker_category saved=categoryRepository.save(workerCategory);
        return convert_to_DTO(saved);
    }


    public List<Worker_categoryresponseDTO> getAllWorkerCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convert_to_DTO)
                .toList();
    }


    public Worker_categoryresponseDTO getWorkerCategoryById(Long id) {

        Worker_category workerCategory=categoryRepository.findById(id).orElseThrow(()->new RuntimeException("worker category not found "));
        return convert_to_DTO(workerCategory);


    }


    public Worker_categoryresponseDTO updateWorkerCategory(Long id, Worker_categoryrequestDTO categoryrequestDTO) {
        if(categoryrequestDTO.getMin_price()>categoryrequestDTO.getMax_price()){
            throw new RuntimeException("Max price cannot be less than min price");
        }
        Worker_category existing=categoryRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Worker Category not found with id "+id));

        Category category=catRepo.findById(categoryrequestDTO.getCat_id())
                .orElseThrow(()->new RuntimeException("Category not found with id: "));

        existing.setMin_price(categoryrequestDTO.getMin_price());
        existing.setMax_price(categoryrequestDTO.getMax_price());
        existing.setCategory(category);

        Worker_category updated= categoryRepository.save(existing);
        return convert_to_DTO(updated);
    }

    public boolean deleteWorkerCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Worker_categoryresponseDTO convert_to_DTO(Worker_category workerCategory){
        return new Worker_categoryresponseDTO(
                workerCategory.getWorkCatId(),
                workerCategory.getMin_price(),
                workerCategory.getMax_price(),
                workerCategory.getWorker().getWorker_id(),
                workerCategory.getWorker().getUsers().getUser_name(),
                workerCategory.getCategory().getCat_id(),
                workerCategory.getCategory().getCat_name()
        );
     }
}
