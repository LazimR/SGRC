package ltech.org.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_session", uniqueConstraints = @UniqueConstraint(columnNames = {"start_time","end_time", "room_id"}))
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    protected Session(){}

    public Session(LocalDateTime startTime, LocalDateTime endTime, Room room, List<Reservation> reservations) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.room = room;
        this.reservations = reservations;
    }

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Reservation> reservations;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Session session)) return false;
        return id != null && id.equals(session.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
