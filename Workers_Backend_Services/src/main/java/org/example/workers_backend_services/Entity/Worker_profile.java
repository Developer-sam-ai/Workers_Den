package org.example.workers_backend_services.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Worker_profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long worker_id;
    private int experience_years;
    private String bio;
    private String profile_image;
    private BigDecimal rating;
    private int completed_jobs;
    @OneToOne
    @JoinColumn(name = "user_id")
    private Users users;
}
