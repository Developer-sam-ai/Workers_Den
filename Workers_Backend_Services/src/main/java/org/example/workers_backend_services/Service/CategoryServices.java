package org.example.workers_backend_services.Service;

import jakarta.persistence.Entity;
import org.example.workers_backend_services.DTO.CategoryRequestDTO;
import org.example.workers_backend_services.DTO.CategoryResponseDTO;
import org.example.workers_backend_services.DTO.UserResponseDTO;
import org.example.workers_backend_services.Entity.Category;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServices {

    @Autowired
    CategoryRepository categoryRepository;
//    @Autowired
//    private Category category;


    public CategoryResponseDTO getCategory(Long id) {
         Category cat=categoryRepository.findById(id).orElseThrow(()->new RuntimeException("category cannot be null"));
         return convertToDTO(cat);
    }

    public List<CategoryResponseDTO> getAllcategory() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public CategoryResponseDTO setCategory(CategoryRequestDTO dto) {
        Category category1=new Category();
        category1.setCat_name(dto.getCat_name());
        category1.setDescription(dto.getDescription());
        Category saved=categoryRepository.save(category1);
        return convertToDTO(saved);

    }

    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {
        Category refined=categoryRepository.findById(id).orElseThrow(()->new RuntimeException("category cant be null"));
        refined.setCat_name(dto.getCat_name());
        refined.setDescription(dto.getDescription());
        Category saved=categoryRepository.save(refined);
        return convertToDTO(saved);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }


    private CategoryResponseDTO convertToDTO(Category category){
        return new CategoryResponseDTO(
                category.getCat_id(),
                category.getCat_name(),
                category.getDescription()
        );
    }
}
