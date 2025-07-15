package com.example.facture.Repositoty;

import com.example.facture.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email); // ✅ pour login avec l'email

    Optional<User> findByUsername(String username); // facultatif si tu en as besoin ailleurs
}
