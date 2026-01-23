package se.jensen.quyen.socialwebappbackend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import se.jensen.quyen.socialwebappbackend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return repository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));
    }
}
