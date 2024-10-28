package com.Airline.DTO;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private final String type = "Bearer";
    private String username;
    private Set<String> roles;

    public JwtResponse(String token, String username, Set<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }
}
