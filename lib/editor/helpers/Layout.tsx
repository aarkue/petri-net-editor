import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
import { useCallback } from "react";
import { useReactFlow, type Node } from "@xyflow/react";
const elk = new ELK();

export const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    // "elk.algorithm": "layered",
    // "elk.layered.spacing.nodeNodeBetweenLayers": 120,
    // "org.eclipse.elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    // "org.eclipse.elk.layered.nodePlacement.strategy": "SIMPLE",
    // "org.eclipse.elk.layered.nodePlacement.favorStraightEdges": "false",
    // "elk.spacing.nodeNode": 100,

    "org.eclipse.elk.randomSeed": 2,
    "elk.direction": "RIGHT",
    "elk.algorithm": "layered",
    // "elk.spacing.edgeNode": 30.0,
    // "elk.spacing.edgeEdge": 30.0,
    // "elk.spacing.nodeNode": 30.0,
    // "elk.layered.spacing.nodeNodeBetweenLayers": 1000,
    "elk.spacing.componentComponent": 75,
    "elk.edgeRouting": "ORTHOGONAL",
    "elk.layered.spacing.baseValue": 3.0,
    "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
  };

  const getLayoutedElements = useCallback(
    (options: any, fitViewAfter: boolean = true) => {
      const nodes = getNodes();
      const layoutOptions = { ...defaultOptions, ...options };
      // void elk.knownLayoutAlgorithms().then((r) => console.log({ r }));
      const graph = {
        id: "root",
        layoutOptions,
        children: nodes.map((n) => {
          return {
            id: n.id,
            width: n.width ?? n.type === "place" ? 2*66 : 130,
            height: n.height ?? n.type === "place" ? 2*66 : 66,
            properties: {
            },
            layoutOptions: {
            },
          }
        }),
        edges: getEdges(),
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      elk.layout(graph as any).then(({ children }: ElkNode) => {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        if (children !== undefined) {
          for (let i = 0; i < children.length; i++) {
            // console.log(nodes[i],children[i])
            nodes[i].position = { x: children[i].x ?? 0, y: children[i].y ?? 0 };
          }
          setNodes([...nodes] as Node<any>[]);
          if (fitViewAfter) {
            setTimeout(() => {
              fitView({ duration: 200 });
              // setTimeout(() => {
              //   fitView();
              // },50)
            },200);
          }
        }
      });
    },
    [],
  );

  return { getLayoutedElements };
};

