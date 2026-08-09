package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Service_request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long service_id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Users customer;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker_profile worker;

    @ManyToOne
    @JoinColumn(name = "cat_id")
    private Category category;

    private String title;

    private String description;

    private String address;

    private LocalDate preferredDate;

    private LocalTime preferredTime;

    @Enumerated(EnumType.STRING)
    private ServiceStatus status;

    private LocalDateTime createdAt;


}
