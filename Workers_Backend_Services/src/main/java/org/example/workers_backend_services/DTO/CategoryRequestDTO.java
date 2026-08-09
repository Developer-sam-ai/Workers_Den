package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDTO {

    @NotBlank(message = "category name cant be blank")
    @Size(min = 2,max = 50,message = "Category name must be between 2-50 char")
    private String cat_name;

    @NotBlank(message = "Description is required")
    @Size(max = 200 ,message = "description must not exceed 255 char")
    private String description;
}
