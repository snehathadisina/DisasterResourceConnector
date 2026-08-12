package com.disaster.disaster_resource_connector.service;

import org.neo4j.driver.Driver;
import org.springframework.stereotype.Service;

@Service
public class DatabaseTestService {

    private final Driver driver;

    public DatabaseTestService(Driver driver) {
        this.driver = driver;
    }

    public String testConnection() {
        try (var session = driver.session()) {
            var result = session.run(
                    "MATCH (d:Disaster) RETURN d.name AS name LIMIT 1"
            );

            if (result.hasNext()) {
                return result.single().get("name").asString();
            }

            return "No disaster found";
        }
    }
    public String getActiveDisaster() {

        try (var session = driver.session()) {

            var result = session.run(
                    """
                    MATCH (d:Disaster)
                    WHERE d.status = "ACTIVE"
                    RETURN d.name AS name
                    LIMIT 10
                    """
            );

            StringBuilder disasters = new StringBuilder();

            while (result.hasNext()) {
                var record = result.next();
                disasters.append(record.get("name").asString()).append("\n");
            }

            return disasters.toString();
        }
    }
}