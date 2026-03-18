package ltech.org.dto;

import ltech.org.entities.Room;

import java.io.Serializable;

public class RoomDTO implements Serializable {

    private Integer id;
    private String name;


    public RoomDTO(){}

    public RoomDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public RoomDTO(Room room){
        this.id = room.getId();
        this.name = room.getName();
    }

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
    public String toString() {
        return "RoomDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
