package me.escoffier.quarkus.summarizer.service;


import dev.langchain4j.agent.tool.Tool;
import io.quarkus.logging.Log;
import jakarta.transaction.Transactional;
import me.escoffier.quarkus.summarizer.model.Claim;
import me.escoffier.quarkus.summarizer.model.CustomerMessage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class ClaimService {

    private final ClaimSummarizerService summarizer;
    private final ClaimFinderService finder;

    public ClaimService(ClaimSummarizerService summarizer,
                        ClaimFinderService finder) {
        this.summarizer = summarizer;
        this.finder = finder;
    }

    public List<Claim> getClaims() {
        return Claim.listAll();
    }

    @Transactional
    public Claim process(String content) {
        var id = finder.findRelatedClaims(content);

        Log.info("Found related claims: " + id);
        if (id != -1) {
            Claim existing = Claim.findById(id);
            // Update the summary and the messages
            var cm = new CustomerMessage();
            cm.message = content;
            cm.persist();
            existing.messages.add(cm);

            List<String> messages = new ArrayList<>();
            for (CustomerMessage message : existing.messages) {
                messages.add(message.message);
            }
            existing.summary = summarizer.summarizeSeveralMessages(messages);
            existing.persist();
            return existing;
        }

        var sentiment = summarizer.analyzeSentiment(content);
        var policyNumber = summarizer.extractPolicyNumber(content);
        var title = summarizer.getTitle(content);
        var summary = summarizer.summarize(content);

        Claim claim = new Claim();
        claim.account = policyNumber;
        claim.summary = summary;

        CustomerMessage message = new CustomerMessage();
        message.message = content;
        message.persist();

        claim.messages = List.of(message);
        claim.sentiment = sentiment;
        claim.title = title;
        claim.persist();
        return claim;
    }

    public Claim getById(long id) {
        return Claim.findById(id);
    }

    @Tool("Get the existing claim from the given policy number, null if none.")
    public Claim getClaimForAccount(String policyNumber) {
        return Claim.find("account", policyNumber).firstResult();
    }
}
