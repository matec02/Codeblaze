package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ListingRepository;
import com.projektr.codeblaze.dao.ScooterRepository;
import com.projektr.codeblaze.domain.Listing;
import com.projektr.codeblaze.domain.Scooter;
import com.projektr.codeblaze.domain.User;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class ScooterService {
    private final ScooterRepository scooterRepository;

    private final ListingRepository listingRepository;
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private static String UPLOAD_FOLDER  = "./IzvorniKod/src/main/resources/static/images";

    @Autowired
    public ScooterService(ScooterRepository scooterRepository, ListingRepository listingRepository){

        this.scooterRepository = scooterRepository;
        this.listingRepository = listingRepository;
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

    public String saveFile(MultipartFile file, String tag, User user) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_FOLDER);
        if (!Files.exists(uploadPath)) {
            logger.info("Upload directory not found, creating: {}", uploadPath.toAbsolutePath());
            Files.createDirectories(uploadPath);
        }
        String fileExtension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String baseFilename = user.getNickname() + "-" + tag;
        String newFilename;
        Path filePath;

        int fileNumber = 1;
        do {
            newFilename = baseFilename + fileNumber + (fileExtension != null ? "." + fileExtension : "");
            filePath = uploadPath.resolve(newFilename);
            fileNumber++;
        } while (Files.exists(filePath));

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("Successfully saved picture as {} at {}", newFilename, uploadPath);
        return newFilename;
    }
    public List<Listing> getAvailableScooters(boolean availability) {

        return listingRepository.findListingsByScooterAvailability();
    }
    public void updateScooterAvailability(Long scooterId, boolean availability) {
        Optional<Scooter> optionalScooter = scooterRepository.findById(scooterId);
        if (optionalScooter.isPresent()) {
            Scooter scooter = optionalScooter.get();
            scooter.setAvailability(availability);
            scooterRepository.save(scooter);
        } else {
            throw new NoSuchElementException("Scooter not found with id: " + scooterId);
        }
    }

    @Transactional
    public Scooter registerScooterAndUploadPhoto(Scooter scooter, User user, String photoUrl) throws IOException {
//        String photoPath = saveFile(scooterPhoto, "SP", user);
        logger.error(photoUrl);
        scooter.setUser(user);
        scooter.setImagePath(photoUrl);
        scooter.setAvailability(false);
        return scooterRepository.save(scooter);
    }


}
