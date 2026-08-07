package com.example.salesheet.controllers;

import com.example.salesheet.dto.InviteDTO;
import com.example.salesheet.entities.User;
import com.example.salesheet.security.CustomUserPrincipal;
import com.example.salesheet.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(principal.getUser());
    }

    @PostMapping("/user/invite")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> invite(@RequestBody InviteDTO dto) {
        userService.inviteSalesperson(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable UUID id, @RequestBody InviteDTO dto) {
        userService.updateSalesperson(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.deleteSalesperson(id);
        return ResponseEntity.noContent().build();
    }
}
