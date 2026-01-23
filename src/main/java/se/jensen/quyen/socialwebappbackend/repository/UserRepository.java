package se.jensen.quyen.socialwebappbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.socialwebappbackend.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
