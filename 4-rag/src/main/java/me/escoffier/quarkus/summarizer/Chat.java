package me.escoffier.quarkus.summarizer;

import io.quarkus.logging.Log;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.WebSocket;
import jakarta.inject.Inject;
import me.escoffier.quarkus.summarizer.service.ChatBotService;

@WebSocket(path = "/chat")
public class Chat {

    @Inject
    ChatBotService service;

    @OnOpen
    public String onOpen() {
        return "Hello, I'm Bob, your insurance advisor, how can I help you?";
    }

    @OnTextMessage
    public String onMessage(String message) {
        Log.infof(">> %s", message);
        var response = service.chat(message);
        Log.infof("<< %s", response);
        return response;
    }

}
