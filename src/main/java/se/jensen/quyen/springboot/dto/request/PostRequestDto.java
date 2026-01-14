package se.jensen.quyen.springboot.dto.request;

public class PostRequestDto {
    private String content;
    private Long userId;

    public String getContent() { return content; }
    public Long getUserId() { return userId; }

    public void setContent(String content) { this.content = content; }
    public void setUserId(Long userId) { this.userId = userId; }
}
