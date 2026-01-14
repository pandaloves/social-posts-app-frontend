package se.jensen.quyen.springboot.service;

import org.springframework.stereotype.Service;
import se.jensen.quyen.springboot.dto.request.FriendshipRequestDto;
import se.jensen.quyen.springboot.dto.response.FriendshipResponseDto;
import se.jensen.quyen.springboot.entity.Friendship;
import se.jensen.quyen.springboot.entity.User;
import se.jensen.quyen.springboot.repository.FriendshipRepository;
import se.jensen.quyen.springboot.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    private final FriendshipRepository repo;
    private final UserRepository userRepo;

    public FriendshipService(FriendshipRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    // Skapa friend request
    public FriendshipResponseDto create(FriendshipRequestDto dto) {
        User r = userRepo.findById(dto.getRequesterUserId()).orElseThrow();
        User a = userRepo.findById(dto.getAddresseeUserId()).orElseThrow();

        Friendship f = new Friendship();
        f.setRequester(r);
        f.setAddressee(a);
        f.setStatus(Friendship.Status.PENDING);

        return toDto(repo.save(f));
    }

    // Accept
    public FriendshipResponseDto accept(Long id) {
        Friendship f = repo.findById(id).orElseThrow();
        f.setStatus(Friendship.Status.ACCEPTED);
        return toDto(repo.save(f));
    }

    // Reject
    public FriendshipResponseDto reject(Long id) {
        Friendship f = repo.findById(id).orElseThrow();
        f.setStatus(Friendship.Status.REJECTED);
        return toDto(repo.save(f));
    }

    // Hämta vänner
    public List<User> getFriends(Long userId) {
        return repo.findByRequesterIdAndStatus(userId, Friendship.Status.ACCEPTED)
                .stream()
                .map(Friendship::getAddressee)
                .collect(Collectors.toList());
    }

    private FriendshipResponseDto toDto(Friendship f) {
        return new FriendshipResponseDto(
                f.getId(),
                f.getRequester().getUsername(),
                f.getAddressee().getUsername(),
                f.getStatus().name()
        );
    }
}
