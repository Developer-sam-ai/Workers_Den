package org.example.workers_backend_services.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Worker_categoryresponseDTO {

    private Long workCatId;
    private double min_price;
    private double max_price;

    private Long worker_id;
    private String worker_name;

    private Long cat_id;
    private String category_name;
}
