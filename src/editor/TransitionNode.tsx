import { useEffect, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";
import DeleteButton from "./DeleteButton";

export type NodeData = {
  label: string | undefined;
};

export default function TransitionNode({ data, id }: NodeProps<NodeData>) {
  const { setNodes } = useReactFlow();
  const [editMode, setEditMode] = useState(false);
  const [invisible, setInvisible] = useState(
    data.label === undefined || data.label === "",
  );
  useEffect(() => {
    setInvisible(data.label === undefined || data.label === "");
  }, [data.label]);

  function applyNameEdit(
    ev:
      | React.FocusEvent<HTMLDivElement, Element>
      | React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    const newLabel = ev.currentTarget.innerText.replace("\n", "");
    setEditMode(false);
    setNodes((nodes) => {
      const newNodes = [...nodes];
      newNodes.map((n) => {
        if (n.id === id) {
          n.data = { label: newLabel || undefined };
        }
        return n;
      });
      return newNodes;
    });
  }
  return (
    <>
      <div
        title={data.label ?? "Invisible"}
        className="transition-node"
        style={{
          backgroundColor: invisible ? "black" : undefined,
        }}
      >
        <DeleteButton nodeID={id} />
        <div className="dragHandle" />
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            contentEditable={editMode}
            suppressContentEditableWarning={true}
            onInput={(ev) => {
              setInvisible(ev.currentTarget.innerText.replace("\n", "") === "");
            }}
            onKeyDownCapture={(ev) => {
              if (ev.key === "Enter") {
                ev.preventDefault();
                ev.stopPropagation();
                ev.currentTarget.blur();
              }
            }}
            onDoubleClickCapture={(ev) => {
              if (editMode) {
                applyNameEdit(ev);
              } else {
                setEditMode(true);
                const el = ev.currentTarget;
                setTimeout(() => {
                  const range = document.createRange();
                  const sel = window.getSelection();
                  range.selectNodeContents(el);
                  if (sel) {
                    sel.removeAllRanges();
                    sel.addRange(range);
                  }
                }, 100);
              }
            }}
            onBlur={(ev) => {
              applyNameEdit(ev);
            }}
            style={{
              overflowWrap: "break-word",
              cursor: editMode ? "text" : undefined,
              overflowY: "hidden",
              padding: "0 0 0 0 ",
              margin: "0",
              maxWidth: "6rem",
              minWidth: "4rem",
              minHeight: "1.5rem",
              display: "block",
              marginInline: "auto",
              textAlign: "center",
              zIndex: 10,
              position: "relative",
            }}
          >
            {data.label}
          </div>
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
