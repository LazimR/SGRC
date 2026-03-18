package ltech.org.dto;

import ltech.org.entities.Chair;
import ltech.org.entities.Room;

import java.io.Serializable;

public class ChairDTO implements Serializable {

    private Integer id;
    private Integer roomId;
    private String roomName;
    private int number;
    private char row;

    public ChairDTO() {
    }

    public ChairDTO(Integer id, Integer roomId, String roomName, int number, char row) {
        this.id = id;
        this.roomId = roomId;
        this.roomName = roomName;
        this.number = number;
        this.row = row;
    }

    public ChairDTO(Chair chair) {
        Room room = chair.getRoom();
        this.id = chair.getId();
        this.roomId = room.getId();
        this.roomName = room.getName();
        this.number = chair.getNumber();
        this.row = chair.getRow();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public char getRow() {
        return row;
    }

    public void setRow(char row) {
        this.row = row;
    }

    @Override
    public String toString() {
        return "ChairDTO{" +
                "id=" + id +
                ", roomId=" + roomId +
                ", roomName='" + roomName + '\'' +
                ", number=" + number +
                ", row=" + row +
                '}';
    }
}
