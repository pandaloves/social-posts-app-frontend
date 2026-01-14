package se.jensen.quyen.springboot.service;

import org.springframework.stereotype.Service;
import se.jensen.quyen.springboot.dto.request.CommentRequestDto;
import se.jensen.quyen.springboot.dto.response.CommentResponseDto;
import se.jensen.quyen.springboot.entity.Comment;
import se.jensen.quyen.springboot.entity.Post;
import se.jensen.quyen.springboot.entity.User;
import se.jensen.quyen.springboot.repository.CommentRepository;
import se.jensen.quyen.springboot.repository.PostRepository;
import se.jensen.quyen.springboot.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public CommentResponseDto create(CommentRequestDto dto, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment(
                dto.getCommentText(),
                LocalDateTime.now(),
                user,
                post
        );

        Comment saved = commentRepository.save(comment);

        return mapToDto(saved);
    }

    public List<CommentResponseDto> getByPost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return commentRepository
                .findByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CommentResponseDto mapToDto(Comment comment) {
        return new CommentResponseDto(
                comment.getId(),
                comment.getCommentText(),
                comment.getCreatedAt(),
                comment.getUser().getUsername()
        );
    }
}
