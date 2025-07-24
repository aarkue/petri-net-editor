import { getNodesBounds, getViewportForBounds, useReactFlow } from "@xyflow/react";
import { toSvg } from "html-to-image";

function downloadImage(dataUrl: string) {
  const a = document.createElement("a");

  a.setAttribute("download", "petri-net.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024 * 2;
const imageHeight = 768 * 2;

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.05,
      4,
      1,
    );

    void toSvg(document.querySelector(".react-flow__viewport") as HTMLElement, {
      width: imageWidth,
      height: imageHeight,
      // canvasHeight: imageHeight * 2,
      // canvasWidth: imageWidth * 2,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
      },
      filter: (node) => {
        if (node.classList && node.classList.contains("delete-button")) {
          return false;
        }
        return true;
      },
    }).then(downloadImage);
  };

  return (
    <button className="download-btn" onClick={onClick}>
      Download Image
    </button>
  );
}

export default DownloadButton;
