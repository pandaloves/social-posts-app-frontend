package se.jensen.quyen.springboot.dto.response;

import java.time.LocalDateTime;

public class PostResponseDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private Long userId;
    private String username;

    public PostResponseDto(Long id, String content, LocalDateTime createdAt,
                           Long userId, String username) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.username = username;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
}
