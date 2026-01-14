package se.jensen.quyen.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.springboot.entity.Friendship;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByAddresseeIdAndStatus(Long id, Friendship.Status status);
    List<Friendship> findByRequesterIdAndStatus(Long id, Friendship.Status status);
}
