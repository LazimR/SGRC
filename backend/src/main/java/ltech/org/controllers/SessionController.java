package ltech.org.controllers;

import ltech.org.dto.SessionDTO;
import ltech.org.services.SessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    private final SessionService service;

    public SessionController(SessionService service) {
        this.service = service;
    }

    @PostMapping
    public SessionDTO create(@RequestBody SessionDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<SessionDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public SessionDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public SessionDTO update(@PathVariable Integer id, @RequestBody SessionDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}