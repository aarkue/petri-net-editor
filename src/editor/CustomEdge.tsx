import { BaseEdge, EdgeProps, getStraightPath, useStoreApi } from "reactflow";
import {
  getIntersectionCirc,
  getIntersectionRect,
} from "./helpers/intersection-calculator";

export default function CustomEdge(props: EdgeProps) {
  const store = useStoreApi();
  const { nodeInternals } = store.getState();
  const targetType: "place" | "transition" = nodeInternals.get(props.target)!
    .type as "place" | "transition";
  const source = nodeInternals.get(props.source)!;
  const target = nodeInternals.get(props.target)!;
  const { x: sourceX, y: sourceY } = source.position;
  const { x: targetX, y: targetY } = target.position;

  const interP =
    targetType === "transition"
      ? getIntersectionRect(sourceX, sourceY, targetX, targetY, 100, 70)
      : getIntersectionCirc(sourceX, sourceY, targetX, targetY, 70);

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX: (interP ?? target.position).x,
    targetY: (interP ?? target.position).y,
  });
  return <BaseEdge path={edgePath} {...props} />;
}
