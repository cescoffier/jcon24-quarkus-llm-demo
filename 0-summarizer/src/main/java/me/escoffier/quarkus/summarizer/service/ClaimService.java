package me.escoffier.quarkus.summarizer.service;


import jakarta.transaction.Transactional;
import me.escoffier.quarkus.summarizer.model.Claim;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ClaimService {

    private final ClaimSummarizerService summarizer;

    public ClaimService(ClaimSummarizerService summarizer) {
        this.summarizer = summarizer;
    }

    public List<Claim> getClaims() {
        return Claim.listAll();
    }

    @Transactional
    public Claim process(String content) {
        var summary = summarizer.summarize(content);
        var sentiment = summarizer.analyzeSentiment(content);
        var policyNumber = summarizer.extractPolicyNumber(content);
        var title = summarizer.getTitle(content);

        Claim claim = new Claim();
        claim.account = policyNumber;
        claim.summary = summary;
        claim.original = content;
        claim.sentiment = sentiment;
        claim.title = title;
        claim.persist();
        return claim;
    }

    public Claim getById(long id) {
        return Claim.findById(id);
    }
}
