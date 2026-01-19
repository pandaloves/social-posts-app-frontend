package se.jensen.quyen.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import se.jensen.quyen.springboot.dto.request.LoginRequestDTO;
import se.jensen.quyen.springboot.dto.response.LoginResponseDTO;
import se.jensen.quyen.springboot.security.MyUserDetails;
import se.jensen.quyen.springboot.security.TokenService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager,
                          TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> token(
            @RequestBody LoginRequestDTO loginRequest
    ) {

        // 🔹 Autentiserar användaren
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()

                )
        );

        // 🔹 Hämtar inloggad användare
        MyUserDetails details = (MyUserDetails) auth.getPrincipal();

        // 🔹 Skapar JWT-token
        String token = tokenService.generateToken(auth);

        // 🔹 Returnerar token + userId till frontend
        return ResponseEntity.ok(
                new LoginResponseDTO(token, details.getId())
        );
    }
}
