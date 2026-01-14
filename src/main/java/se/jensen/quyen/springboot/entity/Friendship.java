package se.jensen.quyen.springboot.entity;

import javax.persistence.*;

@Entity
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User requester;

    @ManyToOne
    private User addressee;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }

    public Friendship() {}

    public Long getId() { return id; }
    public User getRequester() { return requester; }
    public User getAddressee() { return addressee; }
    public Status getStatus() { return status; }

    public void setRequester(User requester) { this.requester = requester; }
    public void setAddressee(User addressee) { this.addressee = addressee; }
    public void setStatus(Status status) { this.status = status; }
}
