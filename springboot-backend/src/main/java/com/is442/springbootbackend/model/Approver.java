package com.is442.springbootbackend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Approver")
public class Approver extends User{
    public Approver() {
    }

    public Approver(String name, String email, String phoneNo, String password) {
        super(name, email, phoneNo, password);
    }
}
