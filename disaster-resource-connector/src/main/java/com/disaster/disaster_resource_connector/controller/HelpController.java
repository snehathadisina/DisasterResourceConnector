package com.disaster.disaster_resource_connector.controller;

import org.neo4j.driver.Driver;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/help")
//@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HelpController {

    private final Driver driver;

    public HelpController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping("/{areaId}")
    public Map<String, Object> getHelp(@PathVariable String areaId) {

        try (var session = driver.session()) {

            var result = session.run(
                    """
                    MATCH (a:Area {id: $areaId})
                    OPTIONAL MATCH (a)-[:HAS_SHELTER]->(s:Shelter)
                    OPTIONAL MATCH (r:Resource)-[:AVAILABLE_AT]->(s)
                    OPTIONAL MATCH (v:Volunteer)-[:ASSIGNED_TO]->(s)
                    OPTIONAL MATCH (v)-[:HAS_SKILL]->(sk:Skill)

                    RETURN
                        a.name AS area,

                        collect(DISTINCT {
                            name: s.name,
                            status: s.status,
                            capacity: s.capacity,
                            currentOccupancy: s.currentOccupancy
                        }) AS shelters,

                        collect(DISTINCT {
                            name: r.name,
                            type: r.type,
                            quantity: r.quantity,
                            unit: r.unit
                        }) AS resources,

                        collect(DISTINCT {
                            name: v.name,
                            skill: sk.name
                        }) AS volunteers
                    """,
                    Map.of("areaId", areaId)
            );

            if (!result.hasNext()) {
                return Map.of(
                        "area", areaId,
                        "shelters", List.of(),
                        "resources", List.of(),
                        "volunteers", List.of()
                );
            }

            var record = result.single();

            return Map.of(
                    "area", record.get("area").asString(),
                    "shelters", record.get("shelters").asList(),
                    "resources", record.get("resources").asList(),
                    "volunteers", record.get("volunteers").asList()
            );
        }
    }
}