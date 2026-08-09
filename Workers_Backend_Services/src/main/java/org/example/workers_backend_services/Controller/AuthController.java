package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.Config.JwtUtil;
import org.example.workers_backend_services.DTO.LoginRequestDTO;
import org.example.workers_backend_services.DTO.LoginResponseDTO;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto){
        Users user=userRepository.findByEmail(dto.getEmail()).orElseThrow(()->new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(dto.getPassword(),user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        String token=jwtUtil.generateToken(user.getEmail(),user.getRole().toString(),user.getUser_id());

        LoginResponseDTO responseDTO=new LoginResponseDTO(
                token,
                user.getEmail(),
                user.getRole().toString()
        );
        return ResponseEntity.ok(responseDTO);
    }
}
