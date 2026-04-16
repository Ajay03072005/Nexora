package com.alumniHub.repository;

import com.alumniHub.entity.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    Optional<Alumni> findByEmail(String email);
    List<Alumni> findByGraduationYear(String graduationYear);
    List<Alumni> findByIsAvailableForHiringTrue();
    List<Alumni> findByIsAvailableForMentoringTrue();
}
