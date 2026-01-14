package se.jensen.quyen.springboot.service;

import org.springframework.stereotype.Service;
import se.jensen.quyen.springboot.dto.request.UserRequestDto;
import se.jensen.quyen.springboot.dto.response.UserResponseDto;
import se.jensen.quyen.springboot.entity.User;
import se.jensen.quyen.springboot.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ DTO -> ENTITY -> SAVE -> ENTITY -> DTO
    public UserResponseDto create(UserRequestDto dto) {

        // 1. DTO -> Entity
        User user = new User(
                dto.getUsername(),
                dto.getEmail(),
                dto.getPassword()
        );

        // 2. Save entity
        User savedUser = userRepository.save(user);

        // 3. Entity -> Response DTO
        return mapToDto(savedUser);
    }

    public List<UserResponseDto> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserResponseDto mapToDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
