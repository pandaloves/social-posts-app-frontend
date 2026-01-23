package se.jensen.quyen.socialwebappbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import se.jensen.quyen.socialwebappbackend.entity.Friendship;
import se.jensen.quyen.socialwebappbackend.entity.FriendshipStatus;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    List<Friendship> findByStatusAndRequester_IdOrStatusAndReceiver_Id(
            FriendshipStatus status1, Long requesterId,
            FriendshipStatus status2, Long receiverId
    );
}
