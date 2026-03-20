package ltech.org.repositories;

import ltech.org.entities.Chair;
import ltech.org.entities.Reservation;
import ltech.org.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    boolean existsByChairAndSession(Chair chair, Session session);
    List<Reservation> findAllByUserId(UUID userId);
}
