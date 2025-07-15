package com.example.facture.Repositoty;
import com.example.facture.entity.Token;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("select t from Token t inner join t.user u where u.id = :id and (t.expired = false or t.revoked = false)")
    List<Token> findAllValidTokenByUser(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.user.id = :id")
    void deleteByUserId(@Param("id") Long id);

    Optional<Token> findByToken(String token);
}
