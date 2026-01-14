package se.jensen.quyen.springboot.controller;

import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.UserRequestDto;
import se.jensen.quyen.springboot.dto.response.UserResponseDto;
import se.jensen.quyen.springboot.service.UserService;

import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponseDto create(@RequestBody UserRequestDto dto) {
        return userService.create(dto);
    }

    @GetMapping
    public List<UserResponseDto> getAll() {
        return userService.getAll();
    }
}
