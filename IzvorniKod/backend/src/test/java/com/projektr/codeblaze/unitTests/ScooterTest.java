package com.projektr.codeblaze.unitTests;

import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ScooterTest {

    @Test
    void testScooterProperties() {

        User user = new User();
        user.setUserId(1L);
        user.setNickname("testUser");

        Scooter scooter = new Scooter();
        scooter.setScooterId(1L);
        scooter.setManufacturer("ScooterCo");
        scooter.setModel("FastScoot");
        scooter.setBatteryCapacity(500);
        scooter.setMaxSpeed(30);
        scooter.setImagePath("/path/to/scooter/image");
        scooter.setMaxRange(100.0);
        scooter.setYearOfManufacture(2022);
        scooter.setAdditionalInformation("Some information about the scooter");
        scooter.setUser(user);
        scooter.setAvailability(true);

        assertEquals(1L, scooter.getScooterId());
        assertEquals("ScooterCo", scooter.getManufacturer());
        assertEquals("FastScoot", scooter.getModel());
        assertEquals(500, scooter.getBatteryCapacity());
        assertEquals(30, scooter.getMaxSpeed());
        assertEquals("/path/to/scooter/image", scooter.getImagePath());
        assertEquals(100.0, scooter.getMaxRange());
        assertEquals(2022, scooter.getYearOfManufacture());
        assertEquals("Some information about the scooter", scooter.getAdditionalInformation());
        assertEquals(user, scooter.getUser());
        assertEquals(true, scooter.getAvailability());
    }

}