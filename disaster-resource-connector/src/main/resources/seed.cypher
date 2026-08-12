// ============================================================
// DisasterResourceConnector — Seed Data
// Run this in the CognoDB console query editor to populate
// the database with sample disaster response data.
// ============================================================

// --- Disaster ---
CREATE (d:Disaster {
    id: "D001",
    name: "Hyderabad Flood 2026",
    type: "FLOOD",
    severity: "HIGH",
    status: "ACTIVE",
    startDate: "2026-08-10",
    description: "Heavy rainfall causing flooding in multiple areas"
});

// --- Areas affected by the disaster ---
MATCH (d:Disaster {id: "D001"})
CREATE (a:Area {
    id: "A001",
    name: "Kukatpally",
    city: "Hyderabad",
    state: "Telangana",
    population: 85000,
    status: "AFFECTED"
})
CREATE (d)-[:AFFECTS]->(a);

MATCH (d:Disaster {id: "D001"})
CREATE (a:Area {
    id: "A002",
    name: "Uppal",
    city: "Hyderabad",
    state: "Telangana",
    population: 75000,
    status: "AFFECTED"
})
CREATE (d)-[:AFFECTS]->(a);

// --- Shelters in each area ---
MATCH (a:Area {id: "A001"})
CREATE (s:Shelter {
    id: "S001",
    name: "Kukatpally Community Relief Center",
    address: "Kukatpally, Hyderabad",
    capacity: 500,
    currentOccupancy: 320,
    status: "OPEN",
    contact: "9876543210"
})
CREATE (a)-[:HAS_SHELTER]->(s);

MATCH (a:Area {id: "A002"})
CREATE (s:Shelter {
    id: "S002",
    name: "Uppal Government Relief Shelter",
    address: "Uppal, Hyderabad",
    capacity: 400,
    currentOccupancy: 180,
    status: "OPEN",
    contact: "9876543211"
})
CREATE (a)-[:HAS_SHELTER]->(s);

// --- Organizations supporting each shelter ---
MATCH (s:Shelter {id: "S001"})
CREATE (o:Organization {
    id: "O001",
    name: "Helping Hands NGO",
    type: "NGO",
    contact: "9876543212",
    email: "help@helpinghands.org",
    status: "ACTIVE"
})
CREATE (s)-[:SUPPORTED_BY]->(o);

MATCH (s:Shelter {id: "S002"})
CREATE (o:Organization {
    id: "O002",
    name: "Hyderabad Relief Foundation",
    type: "RELIEF_ORGANIZATION",
    contact: "9876543213",
    email: "contact@hrf.org",
    status: "ACTIVE"
})
CREATE (s)-[:SUPPORTED_BY]->(o);

// --- Resources provided by organizations, available at shelters ---
MATCH (o:Organization {id: "O001"})
MATCH (s:Shelter {id: "S001"})
CREATE (r:Resource {
    id: "R001",
    name: "Medical Kits",
    category: "MEDICAL",
    quantity: 50,
    unit: "KITS",
    status: "AVAILABLE"
})
CREATE (o)-[:PROVIDES {
    quantity: 50,
    providedDate: "2026-08-10",
    status: "AVAILABLE"
}]->(r)
CREATE (r)-[:AVAILABLE_AT {
    quantity: 25,
    lastUpdated: "2026-08-10",
    status: "AVAILABLE"
}]->(s);

MATCH (o:Organization {id: "O002"})
MATCH (s:Shelter {id: "S002"})
CREATE (water:Resource {
    id: "R002",
    name: "Drinking Water",
    category: "WATER",
    quantity: 1000,
    unit: "LITERS",
    status: "AVAILABLE"
})
CREATE (food:Resource {
    id: "R003",
    name: "Food Packets",
    category: "FOOD",
    quantity: 500,
    unit: "PACKETS",
    status: "AVAILABLE"
})
CREATE (o)-[:PROVIDES {
    quantity: 1000,
    providedDate: "2026-08-10",
    status: "AVAILABLE"
}]->(water)
CREATE (water)-[:AVAILABLE_AT {
    quantity: 600,
    lastUpdated: "2026-08-10",
    status: "AVAILABLE"
}]->(s)
CREATE (o)-[:PROVIDES {
    quantity: 500,
    providedDate: "2026-08-10",
    status: "AVAILABLE"
}]->(food)
CREATE (food)-[:AVAILABLE_AT {
    quantity: 300,
    lastUpdated: "2026-08-10",
    status: "AVAILABLE"
}]->(s);

// --- Volunteers assigned to shelters, with skills ---
MATCH (o:Organization {id: "O001"})
MATCH (s:Shelter {id: "S001"})
CREATE (v:Volunteer {
    id: "V001",
    name: "Rahul",
    contact: "9876543214",
    availability: "AVAILABLE",
    status: "ACTIVE"
})
CREATE (o)-[:HAS_VOLUNTEER]->(v)
CREATE (v)-[:ASSIGNED_TO {
    role: "Medical Support",
    assignedDate: "2026-08-10",
    status: "ACTIVE"
}]->(s);

MATCH (v:Volunteer {id: "V001"})
CREATE (sk:Skill {
    id: "SK001",
    name: "First Aid",
    category: "MEDICAL"
})
CREATE (v)-[:HAS_SKILL {
    proficiency: "ADVANCED"
}]->(sk);

MATCH (o:Organization {id: "O001"})
MATCH (s:Shelter {id: "S001"})
CREATE (v:Volunteer {
    id: "V002",
    name: "Priya",
    contact: "9876543215",
    availability: "AVAILABLE",
    status: "ACTIVE"
})
CREATE (o)-[:HAS_VOLUNTEER]->(v)
CREATE (v)-[:ASSIGNED_TO {
    role: "Food Distribution",
    assignedDate: "2026-08-10",
    status: "ACTIVE"
}]->(s);

MATCH (v:Volunteer {id: "V002"})
CREATE (sk:Skill {
    id: "SK002",
    name: "Food Distribution",
    category: "RELIEF"
})
CREATE (v)-[:HAS_SKILL {
    proficiency: "INTERMEDIATE"
}]->(sk);

MATCH (o:Organization {id: "O002"})
MATCH (s:Shelter {id: "S002"})
CREATE (v:Volunteer {
    id: "V003",
    name: "Arjun",
    contact: "9876543216",
    availability: "AVAILABLE",
    status: "ACTIVE"
})
CREATE (o)-[:HAS_VOLUNTEER]->(v)
CREATE (v)-[:ASSIGNED_TO {
    role: "Emergency Support",
    assignedDate: "2026-08-10",
    status: "ACTIVE"
}]->(s);

MATCH (v:Volunteer {id: "V003"})
CREATE (sk:Skill {
    id: "SK003",
    name: "Emergency Response",
    category: "EMERGENCY"
})
CREATE (v)-[:HAS_SKILL {
    proficiency: "ADVANCED"
}]->(sk);
