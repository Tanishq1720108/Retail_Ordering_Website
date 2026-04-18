package com.retail.ordering.repository;

import com.retail.ordering.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
//    @Query("SELECT * FROM CUstomer c Join Orders 0 on c.id=o.id")
}