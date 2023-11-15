package com.projektr.codeblaze.utils;

import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import lombok.Data;

@Data
public class ScooterRegistrationDTO {
    private User user;
    private Scooter scooter;
}
