package se.jensen.quyen.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.springboot.entity.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
}
