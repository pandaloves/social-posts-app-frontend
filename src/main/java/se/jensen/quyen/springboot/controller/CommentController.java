package se.jensen.quyen.springboot.controller;

import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.CommentRequestDto;
import se.jensen.quyen.springboot.dto.response.CommentResponseDto;
import se.jensen.quyen.springboot.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentResponseDto create(
            @RequestBody CommentRequestDto dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        String username = authHeader.replace("Bearer ", "");
        return commentService.create(dto, username);
    }

    @GetMapping("/post/{postId}")
    public List<CommentResponseDto> getByPost(@PathVariable Long postId) {
        return commentService.getByPost(postId);
    }
}
