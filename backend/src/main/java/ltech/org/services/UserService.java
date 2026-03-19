package ltech.org.services;

import ltech.org.dto.CreateUserDTO;
import ltech.org.dto.UserDTO;
import ltech.org.entities.User;
import ltech.org.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository repository){
        this.repository = repository;
    }

    public UserDTO getOrCreateUser(UUID id, String email, String fullName) {

        return repository.findById(id)
                .map(UserDTO::new)
                .orElseGet(() -> {
                    // cria com dados obrigatórios
                    User user = new User(id, fullName, email);
                    User saved = repository.save(user);
                    return new UserDTO(saved);
                });
    }
    
    public List<UserDTO> findAll(){
        List<User> users = repository.findAll();
        List<UserDTO> list = new ArrayList<>();

        for(User user : users){
            list.add(new UserDTO(user));
        }

        return list;
    }
    
    public UserDTO findById(UUID id){
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new UserDTO(user);
    }

    public UserDTO update(UUID id, CreateUserDTO updatedUser){
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        User savedUser = repository.save(user);

        return new UserDTO(savedUser);
    }

    public void delete(UUID id){
        if(!repository.existsById(id)){
            throw new RuntimeException("Usuário não encontrado");
        }

        repository.deleteById(id);
    }
}