package com.billpoint.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "staff_profiles")
public class StaffProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
    private ClientProfile client;

    @Column(name = "code_of_the_day")
    private String codeOfTheDay;

    @Column(name = "last_attendance")
    private LocalDate lastAttendance;

    // Constructors
    public StaffProfile() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ClientProfile getClient() { return client; }
    public void setClient(ClientProfile client) { this.client = client; }

    public String getCodeOfTheDay() { return codeOfTheDay; }
    public void setCodeOfTheDay(String codeOfTheDay) { this.codeOfTheDay = codeOfTheDay; }

    public LocalDate getLastAttendance() { return lastAttendance; }
    public void setLastAttendance(LocalDate lastAttendance) { this.lastAttendance = lastAttendance; }
}
