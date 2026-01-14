package se.jensen.quyen.springboot.service;

import org.springframework.stereotype.Service;
import se.jensen.quyen.springboot.entity.Post;
import se.jensen.quyen.springboot.entity.User;
import se.jensen.quyen.springboot.repository.PostRepository;
import se.jensen.quyen.springboot.repository.UserRepository;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Post create(String content, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = new Post(content, user);   // constructor đã đúng
        return postRepository.save(post);
    }

    public List<Post> getFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getUserWall(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
