package ltech.org.controllers;

import ltech.org.dto.RoomDTO;
import ltech.org.services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @PostMapping
    public RoomDTO create(@RequestBody RoomDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<RoomDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RoomDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public RoomDTO update(@PathVariable Integer id, @RequestBody RoomDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}