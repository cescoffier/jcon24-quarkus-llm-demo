package me.escoffier.quarkus.summarizer.service;


import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import me.escoffier.quarkus.summarizer.model.Sentiment;

@RegisterAiService
@SystemMessage("""
        You are an assistant to the claims department.
        """)
public interface ClaimSummarizerService {

    @UserMessage("""
            Extract a title line from the given claim.
            
            {text}
            """)
    String getTitle(String text);

    @UserMessage("""
            Summarize the given claim in less than 50 words.
            
            {text}
            
            """)
    String summarize(String text);


    @UserMessage("""
            Analyze the sentiment of the given claim.
            The response is either NEGATIVE or POSITIVE.
            
            {text}
            """)
    Sentiment analyzeSentiment(String text);

    @UserMessage("""
            Extract the policy number from the given claim.
            
            {text}
            """)
    String extractPolicyNumber(String text);

}
