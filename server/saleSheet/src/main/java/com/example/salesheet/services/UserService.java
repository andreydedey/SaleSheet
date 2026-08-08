package com.example.salesheet.services;

import com.example.salesheet.dto.InviteDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.enums.Role;
import com.example.salesheet.enums.Status;
import com.example.salesheet.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

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

        log.info("Salesperson invited: name={}, email={}", dto.getName(), dto.getEmail());
        emailService.sendInvite(dto.getEmail(), dto.getName());
    }

    public void updateSalesperson(UUID id, InviteDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        userRepository.save(user);
        log.info("Salesperson updated: id={}, name={}, email={}", id, dto.getName(), dto.getEmail());
    }

    public void deleteSalesperson(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        userRepository.delete(user);
        log.info("Salesperson deleted: id={}", id);
    }
}
