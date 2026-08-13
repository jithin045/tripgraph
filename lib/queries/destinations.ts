import { driver } from "@/lib/cognodb";

export type Attraction = {
  name: string;
  description: string;
};

export type Restaurant = {
  name: string;
  cuisine: string;
};

export type ConnectedDestination = {
  name: string;
  slug: string;
};

export type Activity = {
  name: string;
  description: string;
};

export type Destination = {
  name: string;
  slug: string;
  description: string;
  attractions: Attraction[];
  restaurants: Restaurant[];
  connectedDestinations: ConnectedDestination[];
};

export async function getDestinationBySlug(
  slug: string
): Promise<Destination | null> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Destination {slug: $slug})
      OPTIONAL MATCH (d)-[:HAS_ATTRACTION]->(a:Attraction)
      OPTIONAL MATCH (d)-[:HAS_RESTAURANT]->(r:Restaurant)
      OPTIONAL MATCH (d)-[:CONNECTED_TO]->(connected:Destination)

      RETURN
        d.name AS name,
        d.slug AS slug,
        d.description AS description,

        collect(DISTINCT {
          name: a.name,
          description: a.description
        }) AS attractions,

        collect(DISTINCT {
          name: r.name,
          cuisine: r.cuisine
        }) AS restaurants,

        collect(DISTINCT {
          name: connected.name,
          slug: connected.slug
        }) AS connectedDestinations
      `,
      { slug }
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      name: record.get("name") as string,
      slug: record.get("slug") as string,
      description: record.get("description") as string,

      attractions: record.get("attractions") as Attraction[],

      restaurants: record.get("restaurants") as Restaurant[],

      connectedDestinations:
        record.get("connectedDestinations") as ConnectedDestination[],
    };
  } finally {
    await session.close();
  }
}

export async function getDestinationActivities(
  slug: string
): Promise<Activity[]> {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (d:Destination {slug: $slug})
            -[:HAS_ATTRACTION]->(a:Attraction)
            -[:OFFERS]->(activity:Activity)

      RETURN DISTINCT
        activity.name AS name,
        activity.description AS description

      ORDER BY activity.name
      `,
      { slug }
    );

    return result.records.map((record) => ({
      name: record.get("name") as string,
      description: record.get("description") as string,
    }));
  } finally {
    await session.close();
  }
}