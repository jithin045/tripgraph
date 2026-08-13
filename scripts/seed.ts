import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config({ path: ".env.local" });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("Missing CognoDB environment variables");
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await session.run("MATCH (n) DETACH DELETE n");

    // =========================================================
    // DESTINATIONS
    // =========================================================

    await session.run(
      `
      UNWIND $destinations AS destination
      CREATE (:Destination {
        name: destination.name,
        slug: destination.slug,
        description: destination.description
      })
      `,
      {
        destinations: [
          {
            name: "Munnar",
            slug: "munnar",
            description:
              "A beautiful hill station known for tea plantations, mountains and scenic landscapes.",
          },
          {
            name: "Wayanad",
            slug: "wayanad",
            description:
              "A nature-rich destination famous for forests, waterfalls and caves.",
          },
          {
            name: "Kochi",
            slug: "kochi",
            description:
              "A historic coastal city combining heritage, culture and modern attractions.",
          },
          {
            name: "Alleppey",
            slug: "alleppey",
            description:
              "A popular backwater destination known for houseboats and beautiful waterways.",
          },
        ],
      }
    );

    // =========================================================
    // ATTRACTIONS
    // =========================================================

    await session.run(
      `
      UNWIND $attractions AS attraction
      CREATE (:Attraction {
        name: attraction.name,
        description: attraction.description
      })
      `,
      {
        attractions: [
          {
            name: "Tea Museum",
            description:
              "Explore the history and heritage of tea production in Munnar.",
          },
          {
            name: "Mattupetty Dam",
            description:
              "A scenic dam surrounded by hills and green landscapes.",
          },
          {
            name: "Edakkal Caves",
            description:
              "Ancient caves containing prehistoric rock engravings.",
          },
          {
            name: "Banasura Sagar Dam",
            description:
              "A scenic destination surrounded by mountains and greenery.",
          },
          {
            name: "Fort Kochi",
            description:
              "A historic area known for colonial architecture and cultural landmarks.",
          },
          {
            name: "Chinese Fishing Nets",
            description:
              "Iconic fishing structures along the coast of Fort Kochi.",
          },
          {
            name: "Alleppey Backwaters",
            description:
              "A network of beautiful waterways best explored by boat.",
          },
        ],
      }
    );

    // =========================================================
    // ACTIVITIES
    // =========================================================

    await session.run(
      `
      UNWIND $activities AS activity
      CREATE (:Activity {
        name: activity.name,
        description: activity.description
      })
      `,
      {
        activities: [
          {
            name: "Trekking",
            description:
              "Explore scenic trails and mountain paths.",
          },
          {
            name: "Sightseeing",
            description:
              "Explore popular landmarks and scenic locations.",
          },
          {
            name: "Photography",
            description:
              "Capture landscapes, wildlife and cultural locations.",
          },
          {
            name: "Boating",
            description:
              "Enjoy lakes, rivers and backwater experiences.",
          },
          {
            name: "Nature Walk",
            description:
              "Explore forests and natural surroundings.",
          },
          {
            name: "Cultural Exploration",
            description:
              "Discover local history, culture and heritage.",
          },
        ],
      }
    );

    // =========================================================
    // RESTAURANTS
    // =========================================================

    await session.run(
      `
      UNWIND $restaurants AS restaurant
      CREATE (:Restaurant {
        name: restaurant.name,
        cuisine: restaurant.cuisine
      })
      `,
      {
        restaurants: [
          {
            name: "Hill View Restaurant",
            cuisine: "Kerala",
          },
          {
            name: "Spice Garden",
            cuisine: "Indian",
          },
          {
            name: "Fort Kochi Cafe",
            cuisine: "Continental",
          },
          {
            name: "Backwater Cafe",
            cuisine: "Kerala",
          },
          {
            name: "Mountain Bites",
            cuisine: "Indian",
          },
        ],
      }
    );

    // =========================================================
    // DESTINATION → ATTRACTION
    // =========================================================

    await session.run(`
      MATCH
        (munnar:Destination {slug: "munnar"}),
        (teaMuseum:Attraction {name: "Tea Museum"}),
        (mattupetty:Attraction {name: "Mattupetty Dam"})
      CREATE
        (munnar)-[:HAS_ATTRACTION]->(teaMuseum),
        (munnar)-[:HAS_ATTRACTION]->(mattupetty)
    `);

    await session.run(`
      MATCH
        (wayanad:Destination {slug: "wayanad"}),
        (edakkal:Attraction {name: "Edakkal Caves"}),
        (banasura:Attraction {name: "Banasura Sagar Dam"})
      CREATE
        (wayanad)-[:HAS_ATTRACTION]->(edakkal),
        (wayanad)-[:HAS_ATTRACTION]->(banasura)
    `);

    await session.run(`
      MATCH
        (kochi:Destination {slug: "kochi"}),
        (fortKochi:Attraction {name: "Fort Kochi"}),
        (fishingNets:Attraction {name: "Chinese Fishing Nets"})
      CREATE
        (kochi)-[:HAS_ATTRACTION]->(fortKochi),
        (kochi)-[:HAS_ATTRACTION]->(fishingNets)
    `);

    await session.run(`
      MATCH
        (alleppey:Destination {slug: "alleppey"}),
        (backwaters:Attraction {name: "Alleppey Backwaters"})
      CREATE
        (alleppey)-[:HAS_ATTRACTION]->(backwaters)
    `);

    // =========================================================
    // ATTRACTION → ACTIVITY
    // =========================================================

    await session.run(`
      MATCH
        (teaMuseum:Attraction {name: "Tea Museum"}),
        (fortKochi:Attraction {name: "Fort Kochi"}),
        (sightseeing:Activity {name: "Sightseeing"}),
        (photography:Activity {name: "Photography"})
      CREATE
        (teaMuseum)-[:OFFERS]->(sightseeing),
        (teaMuseum)-[:OFFERS]->(photography),
        (fortKochi)-[:OFFERS]->(sightseeing),
        (fortKochi)-[:OFFERS]->(photography)
    `);

    await session.run(`
      MATCH
        (mattupetty:Attraction {name: "Mattupetty Dam"}),
        (banasura:Attraction {name: "Banasura Sagar Dam"}),
        (trekking:Activity {name: "Trekking"}),
        (boating:Activity {name: "Boating"}),
        (natureWalk:Activity {name: "Nature Walk"})
      CREATE
        (mattupetty)-[:OFFERS]->(boating),
        (mattupetty)-[:OFFERS]->(natureWalk),
        (banasura)-[:OFFERS]->(boating),
        (banasura)-[:OFFERS]->(trekking),
        (banasura)-[:OFFERS]->(natureWalk)
    `);

    await session.run(`
      MATCH
        (edakkal:Attraction {name: "Edakkal Caves"}),
        (fishingNets:Attraction {name: "Chinese Fishing Nets"}),
        (trekking:Activity {name: "Trekking"}),
        (photography:Activity {name: "Photography"}),
        (culture:Activity {name: "Cultural Exploration"})
      CREATE
        (edakkal)-[:OFFERS]->(trekking),
        (edakkal)-[:OFFERS]->(photography),
        (fishingNets)-[:OFFERS]->(photography),
        (fishingNets)-[:OFFERS]->(culture)
    `);

    await session.run(`
      MATCH
        (backwaters:Attraction {name: "Alleppey Backwaters"}),
        (boating:Activity {name: "Boating"}),
        (photography:Activity {name: "Photography"})
      CREATE
        (backwaters)-[:OFFERS]->(boating),
        (backwaters)-[:OFFERS]->(photography)
    `);

    // =========================================================
    // DESTINATION → RESTAURANT
    // =========================================================

    await session.run(`
      MATCH
        (munnar:Destination {slug: "munnar"}),
        (restaurant:Restaurant {name: "Hill View Restaurant"})
      CREATE
        (munnar)-[:HAS_RESTAURANT]->(restaurant)
    `);

    await session.run(`
      MATCH
        (munnar:Destination {slug: "munnar"}),
        (restaurant:Restaurant {name: "Mountain Bites"})
      CREATE
        (munnar)-[:HAS_RESTAURANT]->(restaurant)
    `);

    await session.run(`
      MATCH
        (kochi:Destination {slug: "kochi"}),
        (restaurant:Restaurant {name: "Fort Kochi Cafe"})
      CREATE
        (kochi)-[:HAS_RESTAURANT]->(restaurant)
    `);

    await session.run(`
      MATCH
        (alleppey:Destination {slug: "alleppey"}),
        (restaurant:Restaurant {name: "Backwater Cafe"})
      CREATE
        (alleppey)-[:HAS_RESTAURANT]->(restaurant)
    `);

    // =========================================================
    // DESTINATION → DESTINATION
    // =========================================================
    //
    // We keep travel connections bidirectional so that
    // exploring any destination shows its nearby connections.
    //
    // Munnar ↔ Kochi
    // Munnar ↔ Wayanad
    // Munnar ↔ Alleppey
    // Kochi ↔ Wayanad
    // Kochi ↔ Alleppey
    //
    // =========================================================

    await session.run(`
      MATCH
        (munnar:Destination {slug: "munnar"}),
        (kochi:Destination {slug: "kochi"}),
        (wayanad:Destination {slug: "wayanad"}),
        (alleppey:Destination {slug: "alleppey"})
      CREATE
        (munnar)-[:CONNECTED_TO]->(kochi),
        (kochi)-[:CONNECTED_TO]->(munnar),

        (munnar)-[:CONNECTED_TO]->(wayanad),
        (wayanad)-[:CONNECTED_TO]->(munnar),

        (munnar)-[:CONNECTED_TO]->(alleppey),
        (alleppey)-[:CONNECTED_TO]->(munnar),

        (kochi)-[:CONNECTED_TO]->(wayanad),
        (wayanad)-[:CONNECTED_TO]->(kochi),

        (kochi)-[:CONNECTED_TO]->(alleppey),
        (alleppey)-[:CONNECTED_TO]->(kochi)
    `);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();