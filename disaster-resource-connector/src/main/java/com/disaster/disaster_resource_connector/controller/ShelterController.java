package com.disaster.disaster_resource_connector.controller;

import org.neo4j.driver.Driver;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final Driver driver;

    public ShelterController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping
    public List<Map<String, Object>> getShelters() {

        try (var session = driver.session()) {

            var result = session.run(
                    """
                    MATCH (s:Shelter)
                    RETURN
                        s.id AS id,
                        s.name AS name,
                        s.status AS status,
                        s.capacity AS capacity,
                        s.currentOccupancy AS currentOccupancy
                    ORDER BY s.name
                    """
            );

            return result.list(record -> Map.of(
                    "id", record.get("id").asString(),
                    "name", record.get("name").asString(),
                    "status", record.get("status").asString(),
                    "capacity", record.get("capacity").asInt(),
                    "currentOccupancy", record.get("currentOccupancy").asInt()
            ));
        }
    }
}