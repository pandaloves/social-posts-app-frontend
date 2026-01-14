package se.jensen.quyen.springboot.controller;

import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.RefreshTokenRequest;
import se.jensen.quyen.springboot.dto.response.JwtResponse;
import se.jensen.quyen.springboot.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/refresh")
    public JwtResponse refresh(@RequestBody RefreshTokenRequest dto) {
        return authService.refresh(dto.getRefreshToken());
    }
}
