import React, { forwardRef } from "react";
import ConicalHatDesigner from "./ConicalHatDesigner";
import { Canvas } from "@react-three/fiber";
const ConicalHatDesignerCanvas = forwardRef((props, ref) => {
  const canvasRef = React.useRef();
  return (
    <Canvas
      camera={{ fov: 30, near: 1, far: 1000, position: [30, 30, 30] }}
      style={{
        backgroundColor: props?.backgroundColor || "#f5f5f5",
        width: props?.width || "100%",
        height: props?.height || "100%",
        // minHeight: props?.minHeight,
        maxWidth: "400px",
        maxHeight: "400px",
      }}
      ref={canvasRef}
    >
      <ConicalHatDesigner {...props} canvasRef={canvasRef} ref={ref}/>
    </Canvas>
  );
});

export default ConicalHatDesignerCanvas;
