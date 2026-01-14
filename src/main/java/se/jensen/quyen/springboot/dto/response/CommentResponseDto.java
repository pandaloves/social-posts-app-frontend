package se.jensen.quyen.springboot.dto.response;

import java.time.LocalDateTime;

public class CommentResponseDto {

    private Long id;
    private String commentText;
    private LocalDateTime createdAt;
    private String username;

    public CommentResponseDto(Long id, String commentText,
                              LocalDateTime createdAt,
                              String username) {
        this.id = id;
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.username = username;
    }

    public Long getId() { return id; }
    public String getCommentText() { return commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUsername() { return username; }
}
