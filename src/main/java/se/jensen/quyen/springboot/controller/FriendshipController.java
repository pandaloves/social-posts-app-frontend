package se.jensen.quyen.springboot.controller;

import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.FriendshipRequestDto;
import se.jensen.quyen.springboot.dto.response.FriendshipResponseDto;
import se.jensen.quyen.springboot.service.FriendshipService;

import java.util.List;

@RestController
@RequestMapping("/friendships")
public class FriendshipController {

    private final FriendshipService service;

    public FriendshipController(FriendshipService service) {
        this.service = service;
    }

    @PostMapping
    public FriendshipResponseDto create(@RequestBody FriendshipRequestDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}/accept")
    public FriendshipResponseDto accept(@PathVariable Long id) {
        return service.accept(id);
    }

    @PutMapping("/{id}/reject")
    public FriendshipResponseDto reject(@PathVariable Long id) {
        return service.reject(id);
    }
}
