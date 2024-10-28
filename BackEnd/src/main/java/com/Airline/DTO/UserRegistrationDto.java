package com.Airline.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDto {

    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "L'email est requis")
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, max = 100)
    private String password;

    // Getters et setters...
}
