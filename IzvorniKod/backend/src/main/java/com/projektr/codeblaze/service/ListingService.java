package com.projektr.codeblaze.service;

import com.projektr.codeblaze.dao.ListingRepository;
import com.projektr.codeblaze.domain.Listing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class ListingService {
    private final ListingRepository listingRepository;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

     @Autowired
    public ListingService(ListingRepository listingRepository) {
         this.listingRepository = listingRepository;
     }

    public Optional<Listing> getListingById(Long listingId) {
         return listingRepository.findById(listingId);
    }
}
