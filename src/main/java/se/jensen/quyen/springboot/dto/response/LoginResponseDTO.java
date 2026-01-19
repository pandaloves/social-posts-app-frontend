package se.jensen.quyen.springboot.dto.response;

/**
 * Response som skickas tillbaka vid lyckad inloggning
 * Innehåller JWT-token och användarens id
 */
public record LoginResponseDTO(
        String token,
        Long userId
) {
}
