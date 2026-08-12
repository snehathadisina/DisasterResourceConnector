package com.disaster.disaster_resource_connector.service;

import com.disaster.disaster_resource_connector.model.HelpResponse;
import org.neo4j.driver.Driver;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class HelpService {

    private final Driver driver;

    public HelpService(Driver driver) {
        this.driver = driver;
    }

    public List<HelpResponse> findHelp(String areaId) {

        try (var session = driver.session()) {

            var result = session.run(
                    """
                    MATCH (a:Area {id: $areaId})
                          -[:HAS_SHELTER]->(s:Shelter)

                    OPTIONAL MATCH (s)<-[av:AVAILABLE_AT]-(r:Resource)

                    OPTIONAL MATCH (s)<-[:ASSIGNED_TO]-(v:Volunteer)
                          -[:HAS_SKILL]->(sk:Skill)

                    RETURN
                        a.name AS area,
                        s.name AS shelter,
                        collect(DISTINCT {
                            resource: r.name,
                            quantity: av.quantity,
                            unit: r.unit
                        }) AS resources,
                        collect(DISTINCT {
                            volunteer: v.name,
                            skill: sk.name
                        }) AS volunteers
                    """,
                    Map.of("areaId", areaId)
            );

            List<HelpResponse> responses = new ArrayList<>();

            while (result.hasNext()) {

                var record = result.next();

                List<Map<String, Object>> resources =
                        record.get("resources").asList(value -> value.asMap());

                List<Map<String, Object>> volunteers =
                        record.get("volunteers").asList(value -> value.asMap());

                responses.add(
                        new HelpResponse(
                                record.get("area").asString(),
                                record.get("shelter").asString(),
                                resources,
                                volunteers
                        )
                );
            }

            return responses;
        }
    }
}