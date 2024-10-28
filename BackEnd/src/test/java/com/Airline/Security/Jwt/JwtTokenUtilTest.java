package com.Airline.Security.Jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

public class JwtTokenUtilTest {

    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private Authentication authentication;

    private final String secret = "fvtpE9CIsCfnHJx7tpIXeB3chpKrIImW2XpfDB0q+J4=";

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        jwtTokenUtil = new JwtTokenUtil(secret);
        jwtTokenUtil.jwtExpirationMs = 3600000; // Set expiration time to 1 hour for tests
    }

    @Test
    public void testGenerateToken() {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getName()).thenReturn("testuser");
        doAnswer(invocation -> authorities).when(authentication).getAuthorities();

        String token = jwtTokenUtil.generateToken(authentication);

        Claims claims = Jwts.parser()
                .setSigningKey(secret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        assertEquals("testuser", claims.getSubject());
        assertEquals(List.of("ROLE_USER"), claims.get("roles"));
    }

    @Test
    public void testGetUsernameFromToken() {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getName()).thenReturn("testuser");
        doAnswer(invocation -> authorities).when(authentication).getAuthorities();

        String token = jwtTokenUtil.generateToken(authentication);

        String username = jwtTokenUtil.getUsernameFromToken(token);

        assertEquals("testuser", username);
    }

    @Test
    public void testGetRolesFromToken() {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getName()).thenReturn("testuser");
        doAnswer(invocation -> authorities).when(authentication).getAuthorities();

        String token = jwtTokenUtil.generateToken(authentication);

        List<String> roles = jwtTokenUtil.getRolesFromToken(token);

        assertEquals(List.of("ROLE_USER"), roles);
    }

    @Test
    public void testValidateToken() {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getName()).thenReturn("testuser");
        doAnswer(invocation -> authorities).when(authentication).getAuthorities();

        String token = jwtTokenUtil.generateToken(authentication);

        boolean isValid = jwtTokenUtil.validateToken(token);

        assertTrue(isValid);
    }

    @Test
    public void testValidateInvalidToken() {
        String invalidToken = "invalidToken";

        boolean isValid = jwtTokenUtil.validateToken(invalidToken);

        assertFalse(isValid);
    }

    @Test
    public void testExpiredToken() {
        jwtTokenUtil.jwtExpirationMs = -1; // Set expiration time to past

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        when(authentication.getName()).thenReturn("testuser");
        doAnswer(invocation -> authorities).when(authentication).getAuthorities();

        String token = jwtTokenUtil.generateToken(authentication);

        boolean isValid = jwtTokenUtil.validateToken(token);

        assertFalse(isValid);
    }
}

