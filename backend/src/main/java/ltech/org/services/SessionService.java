package ltech.org.services;

import ltech.org.dto.SessionDTO;
import ltech.org.entities.Room;
import ltech.org.entities.Session;
import ltech.org.repositories.RoomRepository;
import ltech.org.repositories.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionService {
    private final SessionRepository sessionRepository;
    private final RoomRepository roomRepository;

    public SessionService(SessionRepository sessionRepository, RoomRepository roomRepository) {
        this.sessionRepository = sessionRepository;
        this.roomRepository = roomRepository;
    }

    public SessionDTO create(SessionDTO dto) {

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Session session = new Session(
                dto.getStartTime(),
                dto.getEndTime(),
                room,
                new ArrayList<>() // começa sem reservas
        );

        Session saved = sessionRepository.save(session);

        return new SessionDTO(saved);
    }

    public List<SessionDTO> findAll() {
        return sessionRepository.findAll()
                .stream()
                .map(SessionDTO::new)
                .toList();
    }

    public SessionDTO findById(Integer id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        return new SessionDTO(session);
    }

    public SessionDTO update(Integer id, SessionDTO dto) {

        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setRoom(room);

        Session updated = sessionRepository.save(session);

        return new SessionDTO(updated);
    }

    public void delete(Integer id) {

        if (!sessionRepository.existsById(id)) {
            throw new RuntimeException("Sessão não encontrada");
        }

        sessionRepository.deleteById(id);
    }
}