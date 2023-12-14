// import ELK, { type ElkNode } from "elkjs/lib/elk.bundled.js";
// import { useCallback } from "react";
// import { useReactFlow, type Node } from "reactflow";
// const elk = new ELK();

// export const useLayoutedElements = () => {
//   const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
//   const defaultOptions = {
//     "elk.algorithm": "layered",
//     "elk.layered.spacing.nodeNodeBetweenLayers": 100,
//     "elk.spacing.nodeNode": 80,
//   };

//   const getLayoutedElements = useCallback(
//     (options: any, fitViewAfter: boolean = true) => {
//       const layoutOptions = { ...defaultOptions, ...options };
//       console.log(elk.knownLayoutAlgorithms().then((r) => console.log({r})))
//       const graph = {
//         id: "root",
//         layoutOptions,
//         children: getNodes(),
//         edges: getEdges(),
//       };

//       // eslint-disable-next-line @typescript-eslint/no-floating-promises
//       elk.layout(graph as any).then(({ children }: ElkNode) => {
//         // By mutating the children in-place we saves ourselves from creating a
//         // needless copy of the nodes array.
//         if (children !== undefined) {
//           children.forEach((node) => {
//             (node as Node<any>).position = { x: node.x ?? 0, y: node.y ?? 0 };
//           });
//           setNodes(children as Node<any>[]);
//           if (fitViewAfter) {
//             window.requestAnimationFrame(() => {
//               fitView({ duration: 200 });
//               // setTimeout(() => {
//               //   fitView();
//               // },50)
//             });
//           }
//         }
//       });
//     },
//     [],
//   );

//   return { getLayoutedElements };
// };
