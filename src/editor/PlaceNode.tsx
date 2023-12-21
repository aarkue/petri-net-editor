import { Handle, NodeProps, Position } from "reactflow";
import DeleteButton from "./DeleteButton";

export default function PlaceNode({ id }: NodeProps) {
  return (
    <>
      <div className="place-node">
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
