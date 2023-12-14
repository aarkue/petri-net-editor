import { Handle, NodeProps, Position } from "reactflow";

export default function PlaceNode({}: NodeProps) {
  return (
    <>
      <div className="place-node">
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
