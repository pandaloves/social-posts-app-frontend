package se.jensen.quyen.socialwebappbackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import se.jensen.quyen.socialwebappbackend.entity.*;
import se.jensen.quyen.socialwebappbackend.repository.FriendshipRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipService {

    private final FriendshipRepository repository;

    // Skicka vänförfrågan
    public Friendship save(Friendship friendship) {
        friendship.setStatus(FriendshipStatus.PENDING);
        return repository.save(friendship);
    }

    // Alla friendships (debug)
    public List<Friendship> getAll() {
        return repository.findAll();
    }

    // Acceptera vänförfrågan
    public Friendship acceptFriendship(Long id) {
        Friendship friendship = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return repository.save(friendship);
    }

    // Mina vänner
    public List<User> getFriendsOfUser(Long userId) {
        List<Friendship> friendships =
                repository.findByStatusAndRequester_IdOrStatusAndReceiver_Id(
                        FriendshipStatus.ACCEPTED, userId,
                        FriendshipStatus.ACCEPTED, userId
                );

        return friendships.stream()
                .map(f -> f.getRequester().getId().equals(userId)
                        ? f.getReceiver()
                        : f.getRequester())
                .toList();
    }
}
