package com.disaster.disaster_resource_connector.controller;

import com.disaster.disaster_resource_connector.service.DatabaseTestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/disasters")
public class DisasterController {

    private final DatabaseTestService service;

    public DisasterController(DatabaseTestService service) {
        this.service = service;
    }

    @GetMapping("/active")
    public String getActiveDisaster() {
        return service.getActiveDisaster();
    }
}