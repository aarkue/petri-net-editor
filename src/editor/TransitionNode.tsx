import { Handle, NodeProps, Position } from "reactflow";

export type NodeData = {
  label: string;
};

export default function TransitionNode({ data }: NodeProps<NodeData>) {
  return (
    <>
      <div className="transition-node">
        <div className="dragHandle" />
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            style={{
              whiteSpace: "break-spaces",
              padding: "0 0 0 0 ",
              margin: "0",
              maxWidth: "4rem",
              display: "block",
              marginInline: "auto",
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
            defaultValue={data.label}
          />
        </div>
        <Handle
          onConnect={(c) => (c.sourceHandle = "transition")}
          type="source"
          position={Position.Bottom}
        />
        <Handle
          onConnect={(c) => (c.sourceHandle = "transition")}
          type="target"
          position={Position.Top}
        />
      </div>
    </>
  );
}
