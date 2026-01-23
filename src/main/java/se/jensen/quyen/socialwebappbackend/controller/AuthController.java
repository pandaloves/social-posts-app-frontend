package se.jensen.quyen.socialwebappbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.socialwebappbackend.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest request) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(), request.password())
        );

        String token = jwtUtil.generateToken(request.username());
        return new TokenResponse(token);
    }

    public record LoginRequest(String username, String password) {}
    public record TokenResponse(String token) {}
}
