import { useReactFlow, Node, Edge, MarkerType } from "@xyflow/react";
import { PlaceData, TransitionData } from "../Editor";

function getNameText(el: Element) {
  const name = el.querySelector("name");
  if (!name) {
    return undefined;
  }
  const text = name.querySelector("text");
  if (!text?.textContent) {
    return undefined;
  }
  return text.textContent;
}
function ImportPNMLButton() {
  const { setNodes, setEdges } = useReactFlow();
  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (ev) => {
    if (ev.currentTarget.files == null || ev.currentTarget.files.length < 1) {
      return;
    }
    const file = ev.currentTarget.files[0];
    const parser = new DOMParser();
    const pnmlString = await file.text();
    const pnmlDoc = parser.parseFromString(pnmlString, "text/xml");
    console.log({ pnmlDoc });
    const pnmlTransitions = [...pnmlDoc.querySelectorAll("page > transition")];

    const transitions: Node<TransitionData>[] = pnmlTransitions
      .map((tEl) => {
        const transitionID =
          tEl.getAttribute("id") ?? tEl.getAttribute("idref");
        const isSilent =
          tEl.querySelector("toolspecific")?.getAttribute("activity") ===
          "$invisible$";
        const name = getNameText(tEl);
        if (!name) {  
          return {
            id: transitionID ?? name!,
            position: { x: 0, y: 0 },
            type: "transition",
            data: { label: isSilent ? undefined : name },
          }
          // return undefined;
        }
        return {
          id: transitionID ?? name,
          position: { x: 0, y: 0 },
          type: "transition",
          data: { label: isSilent ? undefined : name },
        } satisfies Node<TransitionData>;
      })
      .filter(
        (t) => t !== undefined,
      );
    console.log({ transitions });

    const pnmlPlaces = [...pnmlDoc.querySelectorAll("page > place")];
    const places: Node<any>[] = pnmlPlaces
      .map((pEl) => {
        const name = getNameText(pEl);
        if (!name) {
          return undefined;
        }
        const placeID = pEl.getAttribute("id") ?? pEl.getAttribute("idref");
        return {
          id: placeID ?? name,
          position: { x: 0, y: 0 },
          type: "place",
          data: { label: name, tokens: parseInt(pEl.querySelector("initialMarking>text")?.textContent ?? "0") },
        } satisfies Node<PlaceData>;
      })
      .filter((t): t is Node<any> & { type: "place" } => t !== undefined);

    const pnmlEdges = [...pnmlDoc.querySelectorAll("page > arc")];
    const edges: Edge<any>[] = pnmlEdges
      .map((eEl) => {
        const edgeID = eEl.getAttribute("id") ?? eEl.getAttribute("idref");
        const source = eEl.getAttribute("source");
        const target = eEl.getAttribute("target");
        if (edgeID == null || source == null || target == null) {
          console.log({ edgeID, source, target, eEl });
          return undefined;
        }
        return {
          id: edgeID,
          source: eEl.getAttribute("source")!,
          target: eEl.getAttribute("target")!,
          type: "custom",
          markerEnd: {
            color: "black",
            type: MarkerType.ArrowClosed,
            width: 16,
            height: 16,
          },
        } satisfies Edge<any>;
      })
      .filter(
        (t): t is Edge<any> & { type: "custom"; markerEnd: any } =>
          t !== undefined,
      );

    console.log({ transitions, places, edges, pnmlEdges });
    setNodes([...transitions, ...places]);
    setEdges(edges);
  };

  return (
    <input
      type="file"
      className="download-btn"
      onChange={onChange}
      accept=".pnml"
    />
  );
}

export default ImportPNMLButton;
