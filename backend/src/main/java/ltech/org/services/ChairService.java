package ltech.org.services;

import ltech.org.dto.ChairDTO;
import ltech.org.entities.Chair;
import ltech.org.entities.Reservation;
import ltech.org.entities.Room;
import ltech.org.repositories.ChairRepository;
import ltech.org.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public ChairDTO create(ChairDTO dto) {

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Chair chair = new Chair(room, dto.getRow(), dto.getNumber(), dto.getCategory());

        Chair saved = chairRepository.save(chair);

        return new ChairDTO(saved);
    }


    @Transactional(readOnly = true)
    public List<ChairDTO> findAll() {
        List<Chair> chairs = chairRepository.findAllWithRoom();
        List<ChairDTO> list = new ArrayList<>();

        for (Chair chair : chairs) {
            list.add(new ChairDTO(chair));
        }

        return list;
    }

    public ChairDTO findById(Integer id) {
        Chair chair = chairRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cadeira não encontrada"));

        return new ChairDTO(chair);
    }

    @Transactional(readOnly = true)
    public List<ChairDTO> findByRoomAndSession(Integer roomId, Integer sessionId) {
        List<Chair> chairs = chairRepository.findAllByRoomIdWithReservations(roomId);
        List<ChairDTO> list = new ArrayList<>();

        for (Chair chair : chairs) {
            ChairDTO newChair = new ChairDTO(chair);

            List<Reservation> reservations = chair.getReservations();

            if (reservations != null) {
                boolean occupied = reservations.stream()
                        .anyMatch(reservation -> reservation.getSession().getId().equals(sessionId));

                newChair.setOcupped(occupied);
            }

            list.add(newChair);
        }

        return list;
    }

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

    public void delete(Integer id) {
        if (!chairRepository.existsById(id)) {
            throw new RuntimeException("Cadeira não encontrada");
        }

        chairRepository.deleteById(id);
    }
}
