package ltech.org.services;

import ltech.org.dto.ReservationDTO;
import ltech.org.entities.*;
import ltech.org.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ChairRepository chairRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public ReservationService(
            ReservationRepository reservationRepository,
            ChairRepository chairRepository,
            SessionRepository sessionRepository,
            UserRepository userRepository
    ) {
        this.reservationRepository = reservationRepository;
        this.chairRepository = chairRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    // CREATE
    public ReservationDTO create(ReservationDTO dto) {

        Chair chair = chairRepository.findById(dto.getChairId())
                .orElseThrow(() -> new RuntimeException("Cadeira não encontrada"));

        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 🚨 REGRA IMPORTANTE: evitar dupla reserva
        boolean alreadyReserved = reservationRepository
                .existsByChairAndSession(chair, session);

        if (alreadyReserved) {
            throw new RuntimeException("Cadeira já reservada para essa sessão");
        }

        Reservation reservation = new Reservation(
                null, // id gerado pelo banco
                chair,
                user,
                session
        );

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationDTO(saved);
    }

    // READ ALL
    public List<ReservationDTO> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(ReservationDTO::new)
                .toList();
    }

    // READ BY ID
    public ReservationDTO findById(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        return new ReservationDTO(reservation);
    }

    // DELETE
    public void delete(Integer id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reserva não encontrada");
        }

        reservationRepository.deleteById(id);
    }
}