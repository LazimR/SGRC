package ltech.org.services;

import ltech.org.dto.RoomDTO;
import ltech.org.entities.Room;
import ltech.org.repositories.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository repository;

    public RoomService(RoomRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public RoomDTO create(RoomDTO dto) {

        Room room = new Room(dto.getName());

        Room saved = repository.save(room);

        return new RoomDTO(saved);
    }

    // READ ALL
    public List<RoomDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(RoomDTO::new)
                .toList();
    }

    // READ BY ID
    public RoomDTO findById(Integer id) {
        Room room = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        return new RoomDTO(room);
    }

    // UPDATE
    public RoomDTO update(Integer id, RoomDTO dto) {

        Room room = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        room.setName(dto.getName());

        Room updated = repository.save(room);

        return new RoomDTO(updated);
    }

    // DELETE
    public void delete(Integer id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Sala não encontrada");
        }

        repository.deleteById(id);
    }
}