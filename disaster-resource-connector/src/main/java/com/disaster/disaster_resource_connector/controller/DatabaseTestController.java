package com.disaster.disaster_resource_connector.controller;

import com.disaster.disaster_resource_connector.service.DatabaseTestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseTestController {

    private final DatabaseTestService service;

    public DatabaseTestController(DatabaseTestService service) {
        this.service = service;
    }

    @GetMapping("/api/test")
    public String testDatabase() {
        return service.testConnection();
    }
}