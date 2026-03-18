package ltech.org.dto;

import ltech.org.entities.Reservation;

import java.io.Serializable;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class ReservationDTO implements Serializable {

    private Integer id;

    private Integer chairId;
    private String chairLabel;

    private String roomName;
    private Integer sessionId;
    private String sessionTime;

    private UUID userId;
    private String userName;

    public ReservationDTO() {
    }

    public ReservationDTO(Integer id, Integer chairId, String chairLabel, String roomName, Integer sessionId, String sessionTime, UUID userId, String userName) {
        this.id = id;
        this.chairId = chairId;
        this.chairLabel = chairLabel;
        this.roomName = roomName;
        this.sessionId = sessionId;
        this.sessionTime = sessionTime;
        this.userId = userId;
        this.userName = userName;
    }

    public ReservationDTO(Reservation reservation) {
        this.id = reservation.getId();

        this.chairId = reservation.getChair().getId();
        int chairNumber = reservation.getChair().getNumber();
        this.chairLabel = String.valueOf(reservation.getChair().getRow()) + chairNumber;

        this.roomName = reservation.getChair().getRoom().getName();

        this.sessionId = reservation.getSession().getId();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        this.sessionTime =
                reservation.getSession().getStartTime().format(formatter)
                        + " - " +
                        reservation.getSession().getEndTime().format(formatter);
        this.userId = reservation.getUser().getId();
        this.userName = reservation.getUser().getName();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(String sessionTime) {
        this.sessionTime = sessionTime;
    }

    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getChairLabel() {
        return chairLabel;
    }

    public void setChairLabel(String chairLabel) {
        this.chairLabel = chairLabel;
    }

    public Integer getChairId() {
        return chairId;
    }

    public void setChairId(Integer chairId) {
        this.chairId = chairId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "ReservationDTO{" +
                "id=" + id +
                ", chairId=" + chairId +
                ", chairLabel='" + chairLabel + '\'' +
                ", roomName='" + roomName + '\'' +
                ", sessionId=" + sessionId +
                ", sessionTime='" + sessionTime + '\'' +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                '}';
    }
}
