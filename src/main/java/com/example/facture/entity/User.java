package com.example.facture.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_users") // Changed table name
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;
    private String password;
}