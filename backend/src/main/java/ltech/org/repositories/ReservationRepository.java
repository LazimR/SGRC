package ltech.org.repositories;

import ltech.org.entities.Chair;
import ltech.org.entities.Reservation;
import ltech.org.entities.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    boolean existsByChairAndSession(Chair chair, Session session);
}
