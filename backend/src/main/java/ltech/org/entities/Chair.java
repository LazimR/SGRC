package ltech.org.entities;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "tb_chair", uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","row","number"}))
public class Chair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

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

    public Chair(Integer id, Room room, char row, int number) {
        this.id = id;
        this.room = room;
        this.row = row;
        this.number = number;
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
