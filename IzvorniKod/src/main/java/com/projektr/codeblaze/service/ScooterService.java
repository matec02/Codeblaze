package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ScooterRepository;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ScooterService {
    private final ScooterRepository scooterRepository;

    @Autowired
    public ScooterService(ScooterRepository scooterRepository){
        this.scooterRepository = scooterRepository;
    }

    public List<Scooter> getAllScooters() {
        return scooterRepository.findAll();
    }

    public Optional<Scooter> getScooterById(Long id) {
        return scooterRepository.findById(id);
    }

    public Scooter saveScooter(Scooter scooter) {
        return scooterRepository.save(scooter);
    }

    public void deleteScooter(Long id) {
        scooterRepository.deleteById(id);
    }

    public List<Scooter> getScootersByUser(User user) {
        return scooterRepository.findByUser(user);
    }

    public List<Scooter> getScootersByUserId(Long userId) {
        return UserService.getUserById(userId)
                .map(scooterRepository::findByUser)
                .orElse(Collections.emptyList());
    }

    public Scooter registerScooter(User user, Scooter scooter) {
        scooter.setUser(user);
        scooter.setAvailability(false);
        return scooterRepository.save(scooter);
    }


    // Dodatna logika TODO

}
