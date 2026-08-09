package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "worker_category")
@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Worker_category {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long workCatId;

    private double min_price;
    private double max_price;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker_profile worker;

    @ManyToOne
    @JoinColumn(name ="cat_id")
    private Category category;
}
