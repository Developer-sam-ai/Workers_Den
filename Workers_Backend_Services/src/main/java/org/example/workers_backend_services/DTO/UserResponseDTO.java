package org.example.workers_backend_services.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserResponseDTO {

    private Long user_id;
    private String user_name;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime created_at;

}
