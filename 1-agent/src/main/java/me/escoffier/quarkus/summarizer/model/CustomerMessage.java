package me.escoffier.quarkus.summarizer.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class CustomerMessage extends PanacheEntity {

    @Column(length = 4 * 1024)
    public String message;

}
