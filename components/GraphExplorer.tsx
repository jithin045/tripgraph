"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";

type GraphNode = {
  id: string;
  label: string;
  type: string;
};

type GraphRelationship = {
  source: string;
  target: string;
  type: string;
};

type Props = {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
};

const NODE_WIDTH = 180;
const NODE_HEIGHT = 70;

const nodeStyles: Record<string, string> = {
  Destination:
    "border-cyan-400 bg-cyan-400/10 text-cyan-300",

  Attraction:
    "border-violet-400 bg-violet-400/10 text-violet-300",

  Activity:
    "border-emerald-400 bg-emerald-400/10 text-emerald-300",

  Restaurant:
    "border-amber-400 bg-amber-400/10 text-amber-300",
};

const relationshipLabels: Record<string, string> = {
  HAS_ATTRACTION: "Attractions",
  HAS_RESTAURANT: "Restaurants",
  OFFERS: "Activities",
  CONNECTED_TO: "Connected destinations",
};

function getLayoutedElements(
  nodes: GraphNode[],
  relationships: GraphRelationship[]
) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
    marginx: 40,
    marginy: 40,
  });

  const flowNodes: Node[] = nodes.map((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });

    const isDestination =
      node.type === "Destination";

    return {
      id: node.id,

      position: {
        x: 0,
        y: 0,
      },

      data: {
        label: (
          <div
            className={`flex h-[70px] w-[180px] flex-col items-center justify-center rounded-xl border ${
              nodeStyles[node.type] ??
              "border-white/20 bg-white/5"
            } ${
              isDestination
                ? "shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                : ""
            }`}
          >
            <span className="text-sm font-semibold">
              {node.label}
            </span>

            <span className="mt-1 text-[11px] text-slate-400">
              {node.type}
            </span>
          </div>
        ),
      },

      style: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        border: "none",
        background: "transparent",
        padding: 0,
      },
    };
  });

  relationships.forEach((relationship) => {
    graph.setEdge(
      relationship.source,
      relationship.target
    );
  });

  dagre.layout(graph);

  const positionedNodes = flowNodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,

      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

const flowEdges: Edge[] = relationships.map(
  (relationship, index) => ({
    id: `edge-${index}`,
    source: relationship.source,
    target: relationship.target,

    label:
      relationshipLabels[relationship.type] ??
      relationship.type,

    type: "smoothstep",

    style: {
      strokeWidth: 1.5,
    },

    labelStyle: {
      fontSize: 10,
      fill: "#94a3b8",
    },

    labelBgStyle: {
      fill: "#020617",
    },

    labelBgPadding: [4, 2],

    labelBgBorderRadius: 4,
  })
);

  return {
    nodes: positionedNodes,
    edges: flowEdges,
  };
}

export default function GraphExplorer({
  nodes,
  relationships,
}: Props) {
  const {
    nodes: layoutedNodes,
    edges: layoutedEdges,
  } = useMemo(
    () =>
      getLayoutedElements(
        nodes,
        relationships
      ),
    [nodes, relationships]
  );

  return (
    <div className="relative h-[650px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
      {/* Graph header */}
      <div className="pointer-events-none absolute left-5 top-5 z-10">
        <div className="rounded-xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-xl backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Relationship graph
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {nodes.length} nodes · {relationships.length} relationships
          </p>
        </div>
      </div>

      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        minZoom={0.25}
        maxZoom={2}
      >
        <Background />

        <Controls />

        <MiniMap
          nodeColor={(node) => {
            const graphNode = nodes.find(
              (item) => item.id === node.id
            );

            if (
              graphNode?.type ===
              "Destination"
            ) {
              return "#22d3ee";
            }

            if (
              graphNode?.type ===
              "Attraction"
            ) {
              return "#a78bfa";
            }

            if (
              graphNode?.type ===
              "Activity"
            ) {
              return "#34d399";
            }

            if (
              graphNode?.type ===
              "Restaurant"
            ) {
              return "#fbbf24";
            }

            return "#64748b";
          }}
        />
      </ReactFlow>
    </div>
  );
}