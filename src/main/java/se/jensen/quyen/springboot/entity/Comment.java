package se.jensen.quyen.springboot.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String commentText;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    private User user;

    @ManyToOne
    private Post post;

    public Comment() {}

    public Comment(String commentText, LocalDateTime createdAt, User user, Post post) {
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.user = user;
        this.post = post;
    }

    public Long getId() { return id; }
    public String getCommentText() { return commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getUser() { return user; }
    public Post getPost() { return post; }

    public void setCommentText(String commentText) { this.commentText = commentText; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUser(User user) { this.user = user; }
    public void setPost(Post post) { this.post = post; }
}
