package com.projektr.codeblaze.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.projektr.codeblaze.domain.Message;
import com.projektr.codeblaze.service.DocumentService;
import com.projektr.codeblaze.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
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

            return new ResponseEntity<>(sentMessage, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error processing message: ", e);
            return ResponseEntity.badRequest().build();
        }
    }
}