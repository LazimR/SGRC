package ltech.org.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_reservation",
    uniqueConstraints = @UniqueConstraint(
            columnNames = {"chair_id", "session_id"}
    )
)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "chair_id", nullable = false)
    private Chair chair;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    public Reservation() {
    }

    public Reservation(Integer id, Chair chair, User user, Session session) {
        this.id = id;
        this.chair = chair;
        this.user = user;
        this.session = session;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Chair getChair() {
        return chair;
    }

    public void setChair(Chair chair) {
        this.chair = chair;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Reservation reservation)) return false;
        return id != null && id.equals(reservation.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
