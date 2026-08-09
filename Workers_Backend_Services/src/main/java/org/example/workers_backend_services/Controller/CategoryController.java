package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.CategoryRequestDTO;
import org.example.workers_backend_services.DTO.CategoryResponseDTO;
import org.example.workers_backend_services.Service.CategoryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Categories")
public class CategoryController {

    @Autowired
    CategoryServices categoryServices;
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategory_byid(@PathVariable Long id){
        CategoryResponseDTO dto=categoryServices.getCategory(id);
        return ResponseEntity.ok(dto);
    }
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategory(){
        List<CategoryResponseDTO> res=categoryServices.getAllcategory();
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> setCategory(@Valid  @RequestBody CategoryRequestDTO dto){
        return ResponseEntity.ok(categoryServices.setCategory(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> putCategory( @PathVariable  Long id,@Valid @RequestBody CategoryRequestDTO dto){
        CategoryResponseDTO category1=categoryServices.updateCategory(id,dto);
        return ResponseEntity.ok(category1);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){
        categoryServices.deleteCategory(id);
        return ResponseEntity.ok(("Category Deleted"));
    }
}
