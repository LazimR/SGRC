package ltech.org.controllers;

import ltech.org.dto.ReservationDTO;
import ltech.org.services.ReservationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ReservationDTO create(@RequestBody ReservationDTO dto, @AuthenticationPrincipal Jwt jwt) {
        return service.create(dto, jwt);
    }

    @GetMapping
    public List<ReservationDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ReservationDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<ReservationDTO> findByUserId(@PathVariable UUID userId) {
        return service.findByUserId(userId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
