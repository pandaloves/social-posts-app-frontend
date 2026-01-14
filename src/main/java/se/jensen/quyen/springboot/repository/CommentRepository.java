package se.jensen.quyen.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.springboot.entity.Comment;
import se.jensen.quyen.springboot.entity.Post;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
}
