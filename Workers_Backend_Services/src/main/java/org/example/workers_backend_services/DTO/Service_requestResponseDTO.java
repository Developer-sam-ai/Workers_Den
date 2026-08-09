package org.example.workers_backend_services.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor

public class Service_requestResponseDTO {
    private Long service_id;

    private Long customer_id;
    private String customerName;

    private Long workerId;
    private String workerName;

    private Long category_id;
    private String categoryName;

    private String title;
    private String description;
    private String address;
    private LocalDate preferredDate;
    private LocalTime preferredTime;
    private String status;
    private LocalDateTime createdAt;

}
