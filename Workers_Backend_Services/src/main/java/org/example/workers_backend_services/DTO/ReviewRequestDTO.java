package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequestDTO {


    @NotNull(message = "Services request id required")
    private Long serviceRequestId;
    @NotNull(message = "Customer id cant required")
    private Long customerId;
    @NotNull(message = "Worker id cant required")
    private Long workerId;
    @NotNull(message = "Rating required")
    @Min(value = 1,message = "Rating must be atleast one")
    @Max(value = 5,message = "Rating must not exceed five")
    private Integer rating;
    @NotBlank(message = "review required")
    @Size(max = 255,message = "review text must not exceed 255 char")
    private String reviewText;

}
