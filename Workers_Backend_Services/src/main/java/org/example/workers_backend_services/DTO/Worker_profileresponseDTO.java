package org.example.workers_backend_services.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor

public class Worker_profileresponseDTO {

    private Long worker_id;
    private int experience_years;
    private String bio;
    private String profile_image;
    private BigDecimal rating;
    private int completed_jobs;

    private Long user_id;
    private String user_name;
}
