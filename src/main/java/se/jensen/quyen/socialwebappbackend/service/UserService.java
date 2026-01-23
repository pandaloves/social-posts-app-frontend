package se.jensen.quyen.socialwebappbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.jensen.quyen.socialwebappbackend.entity.User;
import se.jensen.quyen.socialwebappbackend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public User save(User user) {
        return repository.save(user);
    }

    public List<User> getAll() {
        return repository.findAll();
    }
}
