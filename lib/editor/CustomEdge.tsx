import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  Position,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import {
  getIntersectionCirc,
  getIntersectionRect,
} from "./helpers/intersection-calculator";
import DeleteButton from "./DeleteButton";

export default function CustomEdge(props: EdgeProps) {
  const {getNode} = useReactFlow();
  const source = getNode(props.source)!;
  const target = getNode(props.target)!;
  const targetType: "place" | "transition" = target
    .type as "place" | "transition";
  const sourceType: "place" | "transition" = source
    .type as "place" | "transition";
  const { x: sourceX, y: sourceY } = source.position;
  const { x: targetX, y: targetY } = target.position;

  let edgePath = "";
  let labelX = sourceX;
  let labelY = sourceY;
  const edgeType: "straight" | "step" | "smooth-step" = "straight" as
    | "straight"
    | "step"
    | "smooth-step";

  if (edgeType === "straight") {
    const interP =
      targetType === "transition"
        ? getIntersectionRect(sourceX, sourceY, targetX, targetY, 130, 67)
        : getIntersectionCirc(sourceX, sourceY, targetX, targetY, 66);
    const interS =
      sourceType === "transition"
        ? getIntersectionRect(targetX, targetY, sourceX, sourceY, 125, 67)
        : getIntersectionCirc(targetX, targetY, sourceX, sourceY, 66);
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX: (interS ?? source.position).x,
      sourceY: (interS ?? source.position).y,
      targetX: (interP ?? target.position).x,
      targetY: (interP ?? target.position).y,
    });
  } else {
    const diffX = targetX - sourceX;
    const diffY = targetY - sourceY;
    const xDominates = Math.abs(diffX) > Math.abs(diffY);

    const correctionTargetX = xDominates
      ? targetType === "place"
        ? -33
        : -66
      : 0;
    const correctionTargetY = xDominates
      ? 0
      : targetType === "place"
      ? -33
      : -33;

    const correctionSourceX = xDominates
      ? sourceType === "place"
        ? -32
        : -64
      : 0;
    const correctionSourceY = xDominates
      ? 0
      : sourceType === "place"
      ? -32
      : -32;
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX: source.position.x + (diffX > 0 ? -1 : 1) * correctionSourceX,
      sourceY: source.position.y + (diffY > 0 ? -1 : 1) * correctionSourceY,
      targetX: target.position.x + (diffX > 0 ? 1 : -1) * correctionTargetX,
      targetY: target.position.y + (diffY > 0 ? 1 : -1) * correctionTargetY,
      borderRadius: edgeType === "smooth-step" ? undefined : 0,
      sourcePosition: xDominates
        ? diffX < 0
          ? Position.Left
          : Position.Right
        : diffY < 0
        ? Position.Top
        : Position.Bottom,
      targetPosition: xDominates
        ? diffX >= 0
          ? Position.Left
          : Position.Right
        : diffY >= 0
        ? Position.Top
        : Position.Bottom,
    });
  }

  return (
    <>
      <BaseEdge path={edgePath} {...props} style={{ stroke: "black", strokeWidth: "2", ...props.style }} />;
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
            width: "0.75rem",
            height: "0.75rem",
          }}
          className={`edge ${props.selected ? "selected" : ""}`}
        >
          <DeleteButton edgeID={props.id} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
