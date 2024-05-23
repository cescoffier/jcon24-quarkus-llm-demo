package me.escoffier.quarkus.summarizer.service;


import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;

import java.util.List;

@RegisterAiService(tools = ClaimService.class)
@SystemMessage("""
        You are an assistant to the claims department.
        """)
public interface ClaimFinderService {
    @UserMessage("""
            Check if there is an existing claim related to the given claim.
            Return the claim id, null if none.
                        
            The existing claim can be found by identifying the policy number from the given claim.
            
            If no claim is found, return -1.
            
            {text}
            
             """)
    Long findRelatedClaims(String text);


}
