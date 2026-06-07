package com.example.backend.security;

import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Service
public class TokenBlacklistService {

    private final Set<String> invalidatedTokens =
            Collections.synchronizedSet(new HashSet<>());

    public void invalidate(String token) {
        invalidatedTokens.add(token);
    }

    public boolean isInvalidated(String token) {
        return invalidatedTokens.contains(token);
    }
}