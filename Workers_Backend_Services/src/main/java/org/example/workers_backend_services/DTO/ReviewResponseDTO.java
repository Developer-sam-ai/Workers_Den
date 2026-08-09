package org.example.workers_backend_services.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor

public class ReviewResponseDTO {

    private Long reviewId;
    private String customerName;
    private String workerName;
    private Long serviceRequestId;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;



}
