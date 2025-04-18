import ReactFlow, {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";
import "reactflow/dist/style.css";
import TransitionNode from "./TransitionNode";
import CustomEdge from "./CustomEdge";
import PlaceNode from "./PlaceNode";
import { useRef, useCallback } from "react";
import type { Connection, Edge, Node } from "reactflow";
import DownloadButton from "./helpers/download-image-button";
import ImportPNMLButton from "./helpers/import-pnml-button";
import { useLayoutedElements } from "./helpers/Layout";
import "./editor.css";
const nodeTypes = {
  transition: TransitionNode,
  place: PlaceNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function InnerEditor() {
  const store = useStoreApi();
  const { screenToFlowPosition } = useReactFlow();
  const getChildNodePosition = (event: MouseEvent) => {
    const panePosition = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    return panePosition;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "transition@@@root",
      type: "transition",
      data: { label: "Create Order" },
      position: { x: 0, y: 0 },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const connectingNodeId = useRef<string | null>(null);

  const { getLayoutedElements } = useLayoutedElements();

  // const { getLayoutedElements } = useLayoutedElements();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const { nodeInternals } = store.getState();

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      // we only want to create a new node if the connection ends on the pane
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );

      const parentNode = nodeInternals.get(connectingNodeId.current!)!;
      const childNodePosition = getChildNodePosition(event as MouseEvent);

      if (targetIsPane && connectingNodeId.current) {
        const newNode: Node = {
          id: Date.now().toString(),
          type: parentNode.type === "place" ? "transition" : "place",
          data: { label: "New Node" },
          position: childNodePosition,
        };

        const newEdge: Edge<any> = {
          id: Date.now().toString(),
          source: parentNode.id,
          target: newNode.id,
          type: "custom",
          markerEnd: {
            color: "black",
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
          },
        };
        setNodes([...nodes, newNode]);
        setEdges([...edges, newEdge]);
      }
    },
    [getChildNodePosition],
  );

  const onConnect = useCallback(
    (c: Edge | Connection) => {
      const { source, target, sourceHandle, targetHandle } = c;
      const sourceNode = nodeInternals.get(source!)!;
      const targetNode = nodeInternals.get(target!)!;
      if (sourceNode.type === targetNode.type) {
        return;
      }
      requestAnimationFrame(() => {
        const h = c.sourceHandle;
        console.log(
          { sourceNode, targetNode, sourceHandle, targetHandle, c },
          c.sourceHandle,
          h,
        );
        setEdges((eds) => {
          const newEds = [...eds];
          const newEdge = {
            id: Date.now().toString(),
            source: h === sourceNode.type ? source! : target!,
            target: h === sourceNode.type ? target! : source!,
            type: "custom",
            markerEnd: {
              color: "black",
              type: MarkerType.ArrowClosed,
              width: 16,
              height: 16,
            },
          };
          newEds.push(newEdge);
          return newEds;
        });
      });
    },
    [setEdges, nodeInternals],
  );

  const nodeOrigin: NodeOrigin = [0.5, 0.5];
  return (
    <ReactFlow className="petri-net-editor"
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeOrigin={nodeOrigin}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      connectionLineStyle={{strokeWidth: 1.5}}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.Straight}
      snapToGrid={true}
      snapGrid={[10, 10]}
      maxZoom={10}
      minZoom={0.33}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        color="#ccc"
        variant={BackgroundVariant.Cross}
        gap={[50, 50]}
        offset={2}
      />
      <Controls showInteractive={false} />
      <Panel
        position="top-right"
        style={{ display: "flex", flexDirection: "row", gap: "5px" }}
      >
        <DownloadButton />
        <ImportPNMLButton />
        <button
          onClick={() => {
            getLayoutedElements(
              { "elk.algorithm": "org.eclipse.elk.layered" },
              true,
            );
          }}
        >
          Layout
        </button>
      </Panel>
    </ReactFlow>
  );
}

export default function Editor() {
  return (
    <ReactFlowProvider>
      <InnerEditor />
    </ReactFlowProvider>
  );
}
