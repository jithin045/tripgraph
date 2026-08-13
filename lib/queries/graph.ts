import { driver } from "@/lib/cognodb";

export type GraphNode = {
  id: string;
  label: string;
  type: string;
};

export type GraphRelationship = {
  source: string;
  target: string;
  type: string;
};

export async function getDestinationGraph(
  slug: string
) {
  const session = driver.session();

  try {
    /*
     * =====================================================
     * 1. Get the selected destination
     * =====================================================
     */
    const destinationResult = await session.run(
      `
      MATCH (d:Destination {slug: $slug})

      RETURN {
        id: elementId(d),
        label: coalesce(d.name, ""),
        type: "Destination"
      } AS destination
      `,
      { slug }
    );

    if (destinationResult.records.length === 0) {
      return null;
    }

    const destination =
      destinationResult.records[0].get(
        "destination"
      ) as GraphNode;

    /*
     * =====================================================
     * 2. Get direct relationships from the destination
     *
     * Destination
     *   ├── HAS_ATTRACTION
     *   ├── HAS_RESTAURANT
     *   └── CONNECTED_TO
     * =====================================================
     */
    const directResult = await session.run(
      `
      MATCH (d:Destination {slug: $slug})

      OPTIONAL MATCH (d)-[r:HAS_ATTRACTION|HAS_RESTAURANT|CONNECTED_TO]->(related)

      RETURN
        collect(
          DISTINCT CASE
            WHEN related IS NOT NULL THEN {
              id: elementId(related),
              label: coalesce(related.name, ""),
              type: head(labels(related))
            }
          END
        ) AS nodes,

        collect(
          DISTINCT CASE
            WHEN r IS NOT NULL THEN {
              source: elementId(startNode(r)),
              target: elementId(endNode(r)),
              type: type(r)
            }
          END
        ) AS relationships
      `,
      { slug }
    );

    const directRecord =
      directResult.records[0];

    const directNodes =
      (directRecord.get("nodes") as (
        | GraphNode
        | null
      )[]).filter(
        (node): node is GraphNode =>
          node !== null
      );

    const directRelationships =
      (
        directRecord.get(
          "relationships"
        ) as (GraphRelationship | null)[]
      ).filter(
        (
          relationship
        ): relationship is GraphRelationship =>
          relationship !== null
      );

    /*
     * =====================================================
     * 3. Get activities through attractions
     *
     * This is the important multi-hop graph query:
     *
     * Destination
     *      ↓
     * Attraction
     *      ↓
     * Activity
     *
     * Two relationship hops.
     * =====================================================
     */
    const activityResult = await session.run(
      `
      MATCH (d:Destination {slug: $slug})
            -[:HAS_ATTRACTION]->
            (a:Attraction)
            -[r:OFFERS]->
            (activity:Activity)

      RETURN
        collect(
          DISTINCT {
            id: elementId(activity),
            label: coalesce(activity.name, ""),
            type: "Activity"
          }
        ) AS nodes,

        collect(
          DISTINCT {
            source: elementId(a),
            target: elementId(activity),
            type: type(r)
          }
        ) AS relationships
      `,
      { slug }
    );

    const activityRecord =
      activityResult.records[0];

    const activityNodes =
      (activityRecord.get(
        "nodes"
      ) as GraphNode[]) ?? [];

    const activityRelationships =
      (activityRecord.get(
        "relationships"
      ) as GraphRelationship[]) ?? [];

    /*
     * =====================================================
     * 4. Combine everything
     * =====================================================
     */

    const allNodes = [
      destination,
      ...directNodes,
      ...activityNodes,
    ];

    const allRelationships = [
      ...directRelationships,
      ...activityRelationships,
    ];

    /*
     * Remove duplicate nodes.
     */
    const uniqueNodes = Array.from(
      new Map(
        allNodes.map((node) => [
          node.id,
          node,
        ])
      ).values()
    );

    /*
     * Remove duplicate relationships.
     */
    const uniqueRelationships =
      Array.from(
        new Map(
          allRelationships.map(
            (relationship) => [
              `${relationship.source}-${relationship.target}-${relationship.type}`,
              relationship,
            ]
          )
        ).values()
      );

    return {
      nodes: uniqueNodes,
      relationships: uniqueRelationships,
    };
  } finally {
    await session.close();
  }
}