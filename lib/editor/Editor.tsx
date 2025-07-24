import {
  ReactFlow,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import TransitionNode from "./TransitionNode";
import CustomEdge from "./CustomEdge";
import PlaceNode from "./PlaceNode";
import { useRef, useCallback, createContext, useContext } from "react";
import type { Connection, Edge, Node, ReactFlowProps } from "@xyflow/react";
import DownloadButton from "./helpers/download-image-button";
import ImportPNMLButton from "./helpers/import-pnml-button";
import { useLayoutedElements } from "./helpers/Layout";
import "./editor.css";
import { LayoutOptions } from "elkjs";
const nodeTypes = {
  transition: TransitionNode,
  place: PlaceNode,
};

export type TransitionData = { label?: string | undefined, className?: string, style?: React.CSSProperties };
export type PlaceData = { label?: string | undefined, tokens?: number, className?: string, style?: React.CSSProperties  }

export type ArcData = { weight?: number };

const edgeTypes = {
  custom: CustomEdge,
};

function InnerEditor() {
  const props = useContext(EditorPropsContext);
  const { screenToFlowPosition, getNode } = useReactFlow();
  const getChildNodePosition = (event: MouseEvent) => {
    const panePosition = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    return panePosition;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes ?? [
    {
      id: "transition@@@root",
      type: "transition",
      data: { label: "Create Order" },
      position: { x: 0, y: 0 },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges ?? []);

  const connectingNodeId = useRef<string | null>(null);

  const { getLayoutedElements } = useLayoutedElements();

  // const { getLayoutedElements } = useLayoutedElements();

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);


  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (props.readOnly) {
        return;
      }
      // we only want to create a new node if the connection ends on the pane
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane",
      );

      const parentNode = getNode(connectingNodeId.current!)!;
      const childNodePosition = getChildNodePosition(event as MouseEvent);

      if (targetIsPane && connectingNodeId.current) {
        const newNode: PetriNetNode = {
          id: Date.now().toString(),
          type: parentNode.type === "place" ? "transition" : "place",
          data: { label: "New Node" },
          position: childNodePosition,
        };

        const newEdge: Edge<ArcData> = {
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
    [getChildNodePosition, getNode, props.readOnly],
  );

  const onConnect = useCallback(
    (c: Edge | Connection) => {
      if (props.readOnly) {
        return;
      }
      const { source, target, sourceHandle, targetHandle } = c;
      const sourceNode = getNode(source!)!;
      const targetNode = getNode(target!)!;
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
    [setEdges, getNode],
  );

  const nodeOrigin: NodeOrigin = [0.5, 0.5];
  return (
    <ReactFlow className={`petri-net-editor ${props.readOnly ? "readonly" : ""}`}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeOrigin={nodeOrigin}
      onConnectStart={onConnectStart}
      nodesConnectable={props.readOnly ? false : undefined}
      onConnectEnd={onConnectEnd}
      connectionLineStyle={{ strokeWidth: 1.5 }}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.Straight}
      snapToGrid={true}
      snapGrid={[10, 10]}
      maxZoom={10}
      minZoom={0.33}
      onBeforeDelete={props.readOnly ? async () => {
        return false
      } : undefined}
      proOptions={{ hideAttribution: true }}
      {...props.editorProps}
    >
      {/* <Background
        color="#ccc"
        variant={BackgroundVariant.Cross}
        gap={[50, 50]}
        offset={2}
      /> */}
      <Controls showInteractive={false} />
      <Panel
        position="top-right"
        style={{ display: "flex", flexDirection: "row", gap: "5px" }}
      >
        <DownloadButton />
        <ImportPNMLButton />
        <button
          onClick={() => {
            getLayoutedElements(props.layoutOptions ?? {},
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
export type PetriNetNode =  ((Node<TransitionData> & { type: "transition" }) | (Node<PlaceData> & { type: "place" }));
export type EditorProps = { readOnly?: boolean, initialNodes?: PetriNetNode[], initialEdges?: Edge<ArcData>[], layoutOptions?: LayoutOptions, editorProps?: ReactFlowProps<PetriNetNode, Edge<ArcData>> }
export const EditorPropsContext = createContext<EditorProps>({});
export default function Editor(props: EditorProps) {
  return (
    <ReactFlowProvider >
      <EditorPropsContext.Provider value={props}>
        <InnerEditor />
      </EditorPropsContext.Provider>
    </ReactFlowProvider>
  );
}
