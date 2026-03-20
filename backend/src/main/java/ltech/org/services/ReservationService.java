package ltech.org.services;

import ltech.org.dto.ReservationDTO;
import ltech.org.dto.UserDTO;
import ltech.org.entities.Chair;
import ltech.org.entities.Reservation;
import ltech.org.entities.Session;
import ltech.org.entities.User;
import ltech.org.repositories.ChairRepository;
import ltech.org.repositories.ReservationRepository;
import ltech.org.repositories.SessionRepository;
import ltech.org.repositories.UserRepository;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ChairRepository chairRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public ReservationService(
            ReservationRepository reservationRepository,
            ChairRepository chairRepository,
            SessionRepository sessionRepository,
            UserRepository userRepository,
            UserService userService
    ) {
        this.reservationRepository = reservationRepository;
        this.chairRepository = chairRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public ReservationDTO create(ReservationDTO dto, Jwt jwt) {
        Chair chair = chairRepository.findById(dto.getChairId())
                .orElseThrow(() -> new RuntimeException("Cadeira nao encontrada"));

        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Sessao nao encontrada"));

        UUID userId = UUID.fromString(jwt.getSubject());
        String email = jwt.getClaim("email");
        String name = jwt.getClaim("name");
        UserDTO authenticatedUser = userService.getOrCreateUser(userId, email, name);
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        boolean alreadyReserved = reservationRepository.existsByChairAndSession(chair, session);
        if (alreadyReserved) {
            throw new RuntimeException("Cadeira ja reservada para essa sessao");
        }

        Reservation reservation = new Reservation(null, chair, user, session);
        Reservation saved = reservationRepository.save(reservation);

        return new ReservationDTO(saved);
    }

    public List<ReservationDTO> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(ReservationDTO::new)
                .toList();
    }

    public ReservationDTO findById(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva nao encontrada"));

        return new ReservationDTO(reservation);
    }

    public void delete(Integer id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reserva nao encontrada");
        }

        reservationRepository.deleteById(id);
    }
}
