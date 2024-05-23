package me.escoffier.quarkus.summarizer.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;

@Entity
public class Claim extends PanacheEntity {

    public String title;

    public String account;

    @Column(length = 1024 * 4)
    public String original;
    @Column(length = 1024)
    public String summary;

    public Sentiment sentiment;

}
