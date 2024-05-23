package me.escoffier.quarkus.summarizer.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
public class Claim extends PanacheEntity {

    public String title;

    public String account;

    @OneToMany
    public List<CustomerMessage> messages;
    @Column(length = 1024)
    public String summary;

    public Sentiment sentiment;

}
