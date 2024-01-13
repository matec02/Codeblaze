package com.projektr.codeblaze.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "imageChangeRequest")
public class ImageChangeRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imageId")
    private Long imageId;

    @Column(name = "oldImageUrl", nullable = false, length = 500)
    private String oldImageUrl;

    @Column(name = "newImageUrl", nullable = false, length = 500)
    private String newImageUrl;

    @Column(name = "complaintTime", nullable = false)
    private LocalDateTime complaintTime;
    public Timestamp getComplaintTime() {
        if (complaintTime != null) {
            return Timestamp.valueOf(complaintTime);
        }
        return null; // Handle the case when paymentTime is null, if needed
    }

    @Column(name = "additionalComments")
    private String additionalComments;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ImageChangeRequestStatus status;

    @Column(name = "approvalTime")
    private LocalDateTime approvalTime;
    public Timestamp getApprovalTime() {
        if (approvalTime != null) {
            return Timestamp.valueOf(approvalTime);
        }
        return null; // Handle the case when paymentTime is null, if needed
    }

    @Column(name = "rejectionReason")
    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "requesterId", referencedColumnName = "userId", nullable = false)
    private User user; //ID?

    @ManyToOne
    @JoinColumn(name = "listingId", referencedColumnName = "listingId")
    private Listing listing;

}
