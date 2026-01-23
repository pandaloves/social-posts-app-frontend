package se.jensen.quyen.socialwebappbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.socialwebappbackend.entity.Friendship;
import se.jensen.quyen.socialwebappbackend.entity.User;
import se.jensen.quyen.socialwebappbackend.service.FriendshipService;

import java.util.List;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService service;

    @PostMapping
    public Friendship create(@RequestBody Friendship friendship) {
        return service.save(friendship);
    }

    @GetMapping
    public List<Friendship> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/accept")
    public Friendship accept(@PathVariable Long id) {
        return service.acceptFriendship(id);
    }

    // Temporärt utan Security (userId i query)
    @GetMapping("/my")
    public List<User> myFriends(@RequestParam Long userId) {
        return service.getFriendsOfUser(userId);
    }
}
