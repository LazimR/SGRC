package ltech.org.entities;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tb_room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private List<Chair> chairs;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    private  List<Session> sessions;

    protected Room (){

    }

    public Room(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public List<Chair> getChairs() { return chairs; }
    public List<Session> getSessions() { return sessions; }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Room room)) return false;
        return id != null && id.equals(room.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
