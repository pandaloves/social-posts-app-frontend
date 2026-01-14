package se.jensen.quyen.springboot.service;

import org.springframework.stereotype.Service;
import se.jensen.quyen.springboot.dto.response.JwtResponse;
import se.jensen.quyen.springboot.security.JwtUtil;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;

    public AuthService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public JwtResponse refresh(String refreshToken) {

        if (!jwtUtil.validate(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.getUsername(refreshToken);
        String newAccessToken = jwtUtil.generateToken(username);

        return new JwtResponse(newAccessToken);
    }
}
