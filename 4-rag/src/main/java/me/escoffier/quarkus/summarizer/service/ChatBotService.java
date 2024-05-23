package me.escoffier.quarkus.summarizer.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import io.quarkiverse.langchain4j.RegisterAiService;
import jakarta.enterprise.context.SessionScoped;
import me.escoffier.quarkus.summarizer.rag.Retriever;

@RegisterAiService(tools = ClaimService.class, retrievalAugmentor = Retriever.class)
@SystemMessage("""
        You are an assistant to the claims department. Answering questions about claims.
        Be polite and helpful.
        
        Before answering, make sure you have the claim number.
        """)
@SessionScoped
public interface ChatBotService {


    String chat(@UserMessage String message);

}
