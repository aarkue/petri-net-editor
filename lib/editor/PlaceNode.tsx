import { Handle, NodeProps, Position } from "reactflow";
import DeleteButton from "./DeleteButton";

export default function PlaceNode({ id, selected,data }: NodeProps) {
  return (
    <>
      <div className={`node place-node ${selected ? "selected" : ""}`}>
      {Array(data.tokens ?? 0)
              .fill(0)
              .map((_, i) => (
                <div key={i} style={{width: "12px", height: "12px",  borderRadius: "100%", background: "black"}}></div>
              ))}
        <DeleteButton nodeID={id} />
        <div className="dragHandle" />
        <Handle
          onConnect={(c) => (c.sourceHandle = "place")}
          type="target"
          position={Position.Top}
        />
        <Handle
          onConnect={(c) => (c.sourceHandle = "place")}
          type="source"
          position={Position.Bottom}
        />
      </div>
    </>
  );
}
