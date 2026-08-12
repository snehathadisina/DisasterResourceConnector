package com.disaster.disaster_resource_connector.model;

import java.util.List;
import java.util.Map;

public class HelpResponse {

    private String area;
    private String shelter;
    private List<Map<String, Object>> resources;
    private List<Map<String, Object>> volunteers;

    public HelpResponse() {
    }

    public HelpResponse(String area,
                        String shelter,
                        List<Map<String, Object>> resources,
                        List<Map<String, Object>> volunteers) {
        this.area = area;
        this.shelter = shelter;
        this.resources = resources;
        this.volunteers = volunteers;
    }

    public String getArea() {
        return area;
    }

    public String getShelter() {
        return shelter;
    }

    public List<Map<String, Object>> getResources() {
        return resources;
    }

    public List<Map<String, Object>> getVolunteers() {
        return volunteers;
    }
}