package se.jensen.quyen.socialwebappbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;
}
