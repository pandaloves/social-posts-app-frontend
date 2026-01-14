package se.jensen.quyen.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.springboot.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
