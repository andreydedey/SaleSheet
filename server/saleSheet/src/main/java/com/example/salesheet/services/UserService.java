package com.example.salesheet.services;

import com.example.salesheet.dto.InviteDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.Status;
import com.example.salesheet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void inviteSalesperson(InviteDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setRole(Role.SALESPERSON);
        user.setStatus(Status.PENDING);
        userRepository.save(user);
    }
}
