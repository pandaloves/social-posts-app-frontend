package se.jensen.quyen.socialwebappbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.socialwebappbackend.entity.User;
import se.jensen.quyen.socialwebappbackend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping
    public User create(@RequestBody User user) {
        return service.save(user);
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAll();
    }
}
