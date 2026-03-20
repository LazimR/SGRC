package ltech.org.controllers;

import ltech.org.dto.ChairDTO;
import ltech.org.services.ChairService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chairs")
public class ChairController {

    private final ChairService service;

    public ChairController(ChairService service) {
        this.service = service;
    }

    @PostMapping
    public ChairDTO create(@RequestBody ChairDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ChairDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/findAll/{room_id}/{session_id}")
    public List<ChairDTO> findAllByRoomIdAndSessionId(@PathVariable Integer room_id, @PathVariable Integer session_id){
        return service.findByRoomAndSession(room_id,session_id);
    }

    @GetMapping("/{id}")
    public ChairDTO findById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public ChairDTO update(@PathVariable Integer id, @RequestBody ChairDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}