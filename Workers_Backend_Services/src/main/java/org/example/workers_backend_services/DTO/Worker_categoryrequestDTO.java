package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Worker_categoryrequestDTO {
    @NotNull(message = "set a min price ")
    @Min(value = 0,message = "minimum value cannot go below 0 ")
    private double min_price;
    @NotNull(message = "set a max price ")
    @Min(value=0,message = "maxprice cannot go below 0 ")
    private double max_price;
    @NotNull(message = "worker_id cant be null")
    private Long worker_id;
    @NotNull(message = "category id cant be null")
    private Long cat_id;
}
