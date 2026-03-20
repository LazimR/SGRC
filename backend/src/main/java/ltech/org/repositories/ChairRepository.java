package ltech.org.repositories;

import ltech.org.entities.Chair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChairRepository extends JpaRepository<Chair, Integer> {

    @Query("""
            select c
            from Chair c
            join fetch c.room
            """)
    List<Chair> findAllWithRoom();

    @Query("""
            select distinct c
            from Chair c
            join fetch c.room
            left join fetch c.reservations r
            left join fetch r.session
            where c.room.id = :roomId
            """)
    List<Chair> findAllByRoomIdWithReservations(@Param("roomId") Integer roomId);
}
