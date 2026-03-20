package ltech.org.services;

import ltech.org.dto.ChairDTO;
import ltech.org.entities.Chair;
import ltech.org.entities.Room;
import ltech.org.repositories.ChairRepository;
import ltech.org.repositories.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChairService {

    private final ChairRepository chairRepository;
    private final RoomRepository roomRepository;

    public ChairService(ChairRepository chairRepository, RoomRepository roomRepository) {
        this.chairRepository = chairRepository;
        this.roomRepository = roomRepository;
    }

    // CREATE
    public ChairDTO create(ChairDTO dto) {

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Chair chair = new Chair(room, dto.getRow(), dto.getNumber(), dto.getCategory());

        Chair saved = chairRepository.save(chair);

        return new ChairDTO(saved);
    }

    // READ ALL
    public List<ChairDTO> findAll() {
        List<Chair> chairs = chairRepository.findAll();
        List<ChairDTO> list = new ArrayList<>();

        for (Chair chair : chairs) {
            list.add(new ChairDTO(chair));
        }

        return list;
    }

    // READ BY ID
    public ChairDTO findById(Integer id) {
        Chair chair = chairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cadeira não encontrada"));

        return new ChairDTO(chair);
    }

    // UPDATE
    public ChairDTO update(Integer id, ChairDTO dto) {

        Chair chair = chairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cadeira não encontrada"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        chair.setRoom(room);
        chair.setNumber(dto.getNumber());
        chair.setRow(dto.getRow());

        Chair updated = chairRepository.save(chair);

        return new ChairDTO(updated);
    }

    // DELETE
    public void delete(Integer id) {
        if (!chairRepository.existsById(id)) {
            throw new RuntimeException("Cadeira não encontrada");
        }

        chairRepository.deleteById(id);
    }
}