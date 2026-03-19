package ltech.org.config;

import ltech.org.entities.Chair;
import ltech.org.entities.Room;
import ltech.org.entities.Session;
import ltech.org.repositories.ChairRepository;
import ltech.org.repositories.RoomRepository;
import ltech.org.repositories.SessionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner seedDatabase(
            RoomRepository roomRepository,
            ChairRepository chairRepository,
            SessionRepository sessionRepository
    ) {
        return args -> {

            if (roomRepository.count() > 0) {
                return;
            }

            List<Room> rooms = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                rooms.add(new Room("Sala " + i));
            }

            roomRepository.saveAll(rooms);

            List<Chair> chairs = new ArrayList<>();

            for (Room room : rooms) {
                for (char row = 'A'; row <= 'J'; row++) {
                    for (int number = 1; number <= 20; number++) {
                        chairs.add(new Chair(room, row, number));
                    }
                }
            }

            chairRepository.saveAll(chairs);

            List<Session> sessions = new ArrayList<>();

            for (Room room : rooms) {

                LocalDateTime base = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);

                sessions.add(new Session(
                        base.plusHours(2),
                        base.plusHours(4),
                        room,
                        new ArrayList<>()
                ));

                sessions.add(new Session(
                        base.plusHours(5),
                        base.plusHours(7),
                        room,
                        new ArrayList<>()
                ));

                sessions.add(new Session(
                        base.plusHours(8),
                        base.plusHours(10),
                        room,
                        new ArrayList<>()
                ));
            }

            sessionRepository.saveAll(sessions);

            System.out.println("Seed do SGRC executado com sucesso!");
        };
    }
}