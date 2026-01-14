package se.jensen.quyen.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.PostRequestDto;
import se.jensen.quyen.springboot.dto.response.PostResponseDto;
import se.jensen.quyen.springboot.entity.Post;
import se.jensen.quyen.springboot.service.PostService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getFeed() {
        List<PostResponseDto> result = postService.getFeed().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDto>> getUserWall(@PathVariable Long userId) {
        List<PostResponseDto> result = postService.getUserWall(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<PostResponseDto> create(@RequestBody PostRequestDto dto) {
        Post saved = postService.create(dto.getContent(), dto.getUserId());
        return ResponseEntity.ok(mapToDto(saved));
    }

    private PostResponseDto mapToDto(Post p) {
        return new PostResponseDto(
                p.getId(),
                p.getContent(),
                p.getCreatedAt(),
                p.getUser().getId(),
                p.getUser().getUsername()
        );
    }
}
