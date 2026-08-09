package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class Worker_profilerequestDTO {
    @Min(value = 0,message = "experience cannot go below 0")
    private int experience_years;
    @NotBlank(message = "bio cannot be empty ")
    @Size(max = 100,message = "bioo cannot exceed 100 words keep it short")
    private String bio;
    private String profile_image;
    @NotNull(message = "user id cant be null")
    private Long user_id;

    // like rating and stuff cant be modified by the user
}
