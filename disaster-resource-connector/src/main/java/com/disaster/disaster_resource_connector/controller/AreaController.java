package com.disaster.disaster_resource_connector.controller;

import org.neo4j.driver.Driver;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AreaController {

    private final Driver driver;

    public AreaController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping
    public List<Map<String, Object>> getAreas() {

        try (var session = driver.session()) {

            var result = session.run(
                    """
                    MATCH (a:Area)
                    RETURN a.id AS id, a.name AS name
                    ORDER BY a.name
                    """
            );

            return result.list(record -> Map.of(
                    "id", record.get("id").asString(),
                    "name", record.get("name").asString()
            ));
        }
    }
}