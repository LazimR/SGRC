package ltech.org.controllers;

import ltech.org.dto.UserDTO;
import ltech.org.services.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public UserDTO me(@AuthenticationPrincipal Jwt jwt) {

        UUID userId = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaim("email");
        String name = jwt.getClaim("name");

        return service.getOrCreateUser(userId, email, name);
    }

    @GetMapping
    public List<UserDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public UserDTO findById(@PathVariable UUID id) {
        return service.findById(id);
    }
}