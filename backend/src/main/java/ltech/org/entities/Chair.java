package ltech.org.entities;

import jakarta.persistence.*;
import ltech.org.entities.enums.ChairType;

import java.util.List;
import java.util.Objects;

;


@Entity
@Table(name = "tb_chair", uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","row","number"}))
public class Chair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private ChairType category;
    @ManyToOne
            @JoinColumn(name = "room_id")
    private Room room;

    @OneToMany(mappedBy = "chair", cascade = CascadeType.ALL)
    private List<Reservation> reservations;

    @Column(nullable = false)
    private char row;

    @Column(nullable = false)
    private int number;

    protected Chair (){}

    public Chair(Room room, char row, int number, ChairType category) {
        this.room = room;
        this.row = row;
        this.number = number;
        this.category = category;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public char getRow() {
        return row;
    }

    public void setRow(char row) {
        this.row = row;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public ChairType getCategory() {
        return category;
    }

    public void setCategory(ChairType category) {
        this.category = category;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Chair chair)) return false;
        return id != null && id.equals(chair.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
