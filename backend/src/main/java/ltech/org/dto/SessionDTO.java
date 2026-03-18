package ltech.org.dto;

import ltech.org.entities.Session;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SessionDTO implements Serializable {

    private Integer id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer roomId;
    private String roomName;
    private String timeRange;

    public SessionDTO() {
    }

    public SessionDTO(Integer id, LocalDateTime startTime, LocalDateTime endTime, String roomName, Integer roomId, String timeRange) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.roomName = roomName;
        this.roomId = roomId;
        this.timeRange = timeRange;
    }

    public SessionDTO(Session session) {
        this.id = session.getId();
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
        this.roomName = session.getRoom().getName();
        this.roomId = session.getRoom().getId();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        this.timeRange =
                startTime.format(formatter) + " - " +
                        endTime.format(formatter);
    }

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

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public void setTimeRange(String timeRange) {
        this.timeRange = timeRange;
    }

    @Override
    public String toString() {
        return "SessionDTO{" +
                "id=" + id +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", roomId=" + roomId +
                ", roomName='" + roomName + '\'' +
                ", timeRange='" + timeRange + '\'' +
                '}';
    }
}
