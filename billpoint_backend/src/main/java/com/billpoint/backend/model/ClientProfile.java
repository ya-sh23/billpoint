package com.billpoint.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "client_profiles")
public class ClientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    private String ownerName;
    private String aadhaar;
    private String gstin;
    private String shopLicense;
    private String propertyPapers;

    @Column(name = "approval_status")
    private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "subscription_expiry")
    private LocalDate subscriptionExpiry;

    // Constructors
    public ClientProfile() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getShopLicense() { return shopLicense; }
    public void setShopLicense(String shopLicense) { this.shopLicense = shopLicense; }

    public String getPropertyPapers() { return propertyPapers; }
    public void setPropertyPapers(String propertyPapers) { this.propertyPapers = propertyPapers; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public LocalDate getSubscriptionExpiry() { return subscriptionExpiry; }
    public void setSubscriptionExpiry(LocalDate subscriptionExpiry) { this.subscriptionExpiry = subscriptionExpiry; }
}
