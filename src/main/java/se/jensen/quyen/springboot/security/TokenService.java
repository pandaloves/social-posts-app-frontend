package se.jensen.quyen.springboot.security;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;

@Service
public class TokenService {

    private final JwtUtil jwtUtil;

    public TokenService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return jwtUtil.generateToken(username);
    }
}
