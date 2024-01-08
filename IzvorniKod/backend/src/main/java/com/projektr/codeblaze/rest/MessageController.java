package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.projektr.codeblaze.domain.ChatSession;
import com.projektr.codeblaze.domain.Message;
import com.projektr.codeblaze.service.ChatSessionService;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.MessageService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final ChatSessionService chatSessionService;

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    public MessageController(MessageService messageService, ChatSessionService chatSessionService) {
        this.messageService = messageService;
        this.chatSessionService = chatSessionService;
    }

    @GetMapping("/session/{chatSessionId}")
    public ResponseEntity<List<Message>> getSortedMessagesByChatSession(@PathVariable Long chatSessionId) {
        List<Message> messages = messageService.getMessagesByChatSessionId(chatSessionId);
        if (messages.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(messages);
    }

    @PostMapping(value = "/send", consumes = "multipart/form-data")
    public ResponseEntity<Message> sendMessage(@RequestPart("msgToBeSent") String messageJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());

            logger.debug("Received message JSON: {}", messageJson);

            Message message = objectMapper.readValue(messageJson, Message.class);
            logger.debug("Deserialized message: {}", message);

            Message sentMessage = messageService.sendMessage(message);
            logger.debug("Sent message: {}", sentMessage);

            // Update the lastMessageTime in ChatSession
            ChatSession chatSession = sentMessage.getChatSession();
            chatSession.setLastMessageTime(OffsetDateTime.now());
            chatSessionService.update(chatSession); // Assuming you have an update method in your service

            return new ResponseEntity<>(sentMessage, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error processing message: ", e);
            return ResponseEntity.badRequest().build();
        }
    }


    @PostMapping("/session/{chatSessionId}/mark-read")
    @Transactional
    public ResponseEntity<?> markMessagesAsRead(@PathVariable Long chatSessionId) {
        try {
            int updatedCount = messageService.markMessagesAsRead(chatSessionId);
            if (updatedCount > 0) {
                logger.info("Marked {} messages as read for chat session {}", updatedCount, chatSessionId);
                return ResponseEntity.ok().build();
            } else {
                logger.info("No messages to mark as read for chat session {}", chatSessionId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error marking messages as read for chat session {}", chatSessionId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}