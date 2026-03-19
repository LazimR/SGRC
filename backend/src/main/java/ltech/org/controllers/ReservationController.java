package ltech.org.controllers;

import ltech.org.dto.ReservationDTO;
import ltech.org.services.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ReservationDTO create(@RequestBody ReservationDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ReservationDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ReservationDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}