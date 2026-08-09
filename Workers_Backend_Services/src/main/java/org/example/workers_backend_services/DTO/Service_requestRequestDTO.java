package org.example.workers_backend_services.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class Service_requestRequestDTO {

    @NotNull(message = "customerid required")
    private Long customerId;
//    private String worker;
    @NotNull(message = "categoryid required")
    private Long categoryId;
    @NotBlank(message = "get a title")
    @Size(max = 30,message = "title cant exceed 30 character")
    private String title;
    @NotBlank(message = "description required")
    @Size(max = 300,message = "description must not excced 300 words")
    private String description;
    @NotBlank(message = "address is required plz get correct address")
    private String address;
    @NotNull(message = "pref date cannot be null")
    private LocalDate preferredDate;
    @NotNull(message = "pref time cannot be null")
    private LocalTime preferredTime;

}
