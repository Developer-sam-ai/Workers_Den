package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @OneToOne
    @JoinColumn(name="service_id")
    private Service_request serviceRequest;

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Users customer;

    @ManyToOne
    @JoinColumn(name="worker_id")
    private Worker_profile worker;

    private Integer rating;

    private String reviewText;

    private LocalDateTime createdAt;
}
