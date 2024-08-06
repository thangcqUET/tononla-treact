import React, {
  Suspense,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { set, throttle } from "lodash";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
const ConicalHatDesigner = forwardRef((props, ref) => {
  // Properties
  // - cone
  const RADIUS = 13.5;
  const HEIGHT = 12.6;
  const RADIUS_SEGMENTS = 32;
  const OPEN_ENDED = true;
  const HEIGHT_SEGMENTS = 100;
  const THETA_START = 0;
  const THETA_LENGTH = Math.PI * 2;
  // - axis
  const AXIS_HEIGHT = 0;

  // generated circly
  const THETA_2D =
    (2 * Math.PI * RADIUS) / Math.sqrt(HEIGHT ** 2 + RADIUS ** 2);
  const RADIUS_2D = Math.sqrt(HEIGHT ** 2 + RADIUS ** 2);
  // utils
  const MINIMUM_CLICK_DURATION = 100;
  const clickDuration = useRef(0);
  const { camera, scene, size } = useThree();
  const decalDiffuse = useLoader(TextureLoader, props?.texture?.imageUrl||"/logo_circle.png");
  const savedDecals = useLoader(TextureLoader, props?.savedMeshInfos?.map((meshInfo)=>meshInfo.texture.imageUrl));
  const raycaster = useRef(new THREE.Raycaster());
  const coneMeshRef = useRef();
  const lineRef = useRef();
  const lineGeometryRef = useRef();
  const breakLineRef = useRef();
  const mouseHelperRef = useRef();
  const previewMeshRef = useRef();
  const [isMoving, setIsMoving] = useState(false);
  const [oldSelectedMesh, setOldSelectedMesh] = useState(null);
  const isInitPreviewMesh = useRef(false);
  const intersectionRef = useRef({
    intersects: false,
    point: null,
  });
  const [params, setParams] = useState({
    scale: 5,
    rotate: false,
    // clear: function () {
    //   removeDecals();
    // },
  });
  const meshInfos = props.meshInfos;
  const setMeshInfos = props.setMeshInfos;
  const isMobile = props.isMobile;

  //   function removeDecals() {
  //     decals.forEach(function (d) {
  //       scene.remove(d);
  //     });
  //     setDecals([]);
  //   }
  useImperativeHandle(ref, () => ({
    removeMeshInfo,
    removeAllMeshInfo,
  }));
  function removeMeshInfo(id) {
    // remove in meshInfos and scene
    const newMeshInfos = meshInfos.filter((meshInfo) => meshInfo.meshId !== id);
    setMeshInfos(newMeshInfos);
    scene.remove(meshInfos.find((meshInfo) => meshInfo.meshId === id).mesh);
  }
  function removeAllMeshInfo() {
    for (let meshInfo of meshInfos) {
      scene.remove(meshInfo.mesh);
    }
    setMeshInfos([]);
  }
  function getDecalMaterial(decalMap=decalDiffuse) {
    decalMap.colorSpace = THREE.SRGBColorSpace;
    const decal = new THREE.MeshPhongMaterial({
      specular: 0x444444,
      map: decalMap,
      //   normalMap: decalNormal,
      normalScale: new THREE.Vector2(1, 1),
      shininess: 30,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      wireframe: false,
    });
    return decal;
  }
  useEffect(() => {
    lineGeometryRef.current.setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ]);
    breakLineRef.current.setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(RADIUS, -HEIGHT, 0),
    ]);
    const textureLoader = new THREE.TextureLoader();
    // initPreviewMesh();
    // const decalDiffuse = textureLoader.load("~/public/logo192.png");
    // setDecalMaterial(decal);
  }, []);
  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
        window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [
    props.texture,
    props.textureScale,
    props.textureRotation,
    props.isMobile,
  ]);
  useEffect(() => {
    if (props.selectedMeshId !== null && props.selectedMeshId !== undefined) {
      const meshInfo = meshInfos.find(
        (meshInfo) => meshInfo.meshId === props.selectedMeshId
      );
      if (meshInfo) {
        //change color of mesh
        const material = meshInfo.mesh.material;
        material.wireframe = true;
        if (oldSelectedMesh === null) {
          setOldSelectedMesh(meshInfo);
        } else {
          //reset old mesh color
          const oldMaterial = oldSelectedMesh.mesh.material;
          oldMaterial.wireframe = false;
          setOldSelectedMesh(meshInfo);
        }
      }
    } else {
      if (oldSelectedMesh !== null) {
        const oldMaterial = oldSelectedMesh.mesh.material;
        oldMaterial.wireframe = false;
        setOldSelectedMesh(null);
      }
    }
  }, [props.selectedMeshId]);
  useEffect(() => {
    if (props.savedMeshInfos) {
      for (let i = 0; i < props.savedMeshInfos.length; i++) {
        const meshInfo = props.savedMeshInfos[i];
        shoot({
          position: new THREE.Vector3(meshInfo.x, meshInfo.y, meshInfo.z),
          orientation: new THREE.Euler(meshInfo.o_x, meshInfo.o_y, meshInfo.o_z),
          textureScale: meshInfo.scale,
          textureRotation: meshInfo.rotation,
          renderOrder: i,
          decalMap: savedDecals[i],
        });
      }
    }
  }, [savedDecals]);
  const initPreviewMesh = ({ position, orientation, size }) => {
    const material = getDecalMaterial();
    material.opacity = 0.5;
    // material.color.setHex(0x000000);
    const m = previewMeshRef.current;
    m.geometry = new DecalGeometry(
      coneMeshRef.current,
      position,
      orientation,
      size
    );
    m.material = material;
    m.renderOrder = props.meshInfos.length; // give decals a fixed render order //TODO: haven't understand yet
    // setPreviewMesh(m);
    isInitPreviewMesh.current = true;
  };
  const updatePreviewMesh = ({ position, orientation, size }) => {
    const m = previewMeshRef.current;
    const tempSize = new THREE.Vector3(
      props.textureScale,
      props.textureScale,
      props.textureScale
    );
    //create new decal geometry
    m.geometry = new DecalGeometry(
      coneMeshRef.current,
      position,
      orientation,
      tempSize
    );
    // update material
    m.material = getDecalMaterial();
    m.material.opacity = 0.5;
    // m.material.color.setHex(0x000000);
  };
  // create throtle function for updatePreviewMesh use lodash
  const updatePreviewMeshThrotle = useCallback(
    throttle(updatePreviewMesh, 100),
    [props.textureScale, props.texture]
  );
  const handlePointerDown = (e) => {
    console.log("pointerdown");
    clickDuration.current = Date.now();
    setIsMoving(false);
  };
  const handlePointerUp = (e) => {
    console.log("pointerup");
    clickDuration.current = Date.now() - clickDuration.current;
    if (clickDuration.current < MINIMUM_CLICK_DURATION || isMoving === false) {
      checkIntersection(e.offsetX, e.offsetY);

      if (intersectionRef.current.intersects) shoot();
    }
  };
  const handlePointerMove = (event) => {
    if (event.isPrimary) {
      const canvasRect = props.canvasRef.current.getBoundingClientRect();
      checkIntersection(event.clientX-canvasRect.left, event.clientY-canvasRect.top);
    }
  };
    const handleTouchDown = (e) => {
        console.log("touchdown");
    };
    const handleTouchUp = (e) => {
        console.log("touchup");
        checkIntersection(e.offsetX, e.offsetY);
        if(props.mobileMode === 1 && intersectionRef.current.intersects) shoot();
    };
    const handleTouchMove = (e) => {
        console.log("touchmove");
    };

  const handleResize = () => {
    //get width and height of canvas, then set aspect ratio of camera

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  };
  const checkIntersection = (x, y) => {
    const mouse = new THREE.Vector2(
      (x / size.width) * 2 - 1,
      -(y / size.height) * 2 + 1
    );
    raycaster.current.setFromCamera(mouse, camera);
    const intersects = raycaster.current.intersectObjects(
      [coneMeshRef.current],
      false
    );
    if (intersects.length > 0) {
      const { point } = intersects[0];
      mouseHelperRef.current.position.copy(point);
      intersectionRef.current = {
        intersects: true,
        point,
      };
      const n = intersects[0].face.normal.clone();
      n.transformDirection(coneMeshRef.current.matrixWorld);
      n.multiplyScalar(10);
      n.add(intersects[0].point);
      mouseHelperRef.current.lookAt(n);
      const line = lineRef.current;
      const positions = line.geometry.attributes.position;
      const p = intersects[0].point;
      positions.setXYZ(0, p.x, p.y, p.z);
      positions.setXYZ(1, n.x, n.y, n.z);
      positions.needsUpdate = true;
      const orientation = new THREE.Euler(
        mouseHelperRef.current.rotation.x,
        mouseHelperRef.current.rotation.y,
        mouseHelperRef.current.rotation.z + (props.textureRotation/360) * 2 * Math.PI
      );
      // update position for previewmesh
      if (isInitPreviewMesh.current) {
        const scale = props.textureScale;
        const size = new THREE.Vector3(scale, scale, scale);
        updatePreviewMeshThrotle({
          position: intersectionRef.current.point,
          orientation: orientation,
          size: size,
        });
      } else {
        const scale = props.textureScale;
        const size = new THREE.Vector3(scale, scale, scale);

        initPreviewMesh({
          position: intersectionRef.current.point,
          orientation: mouseHelperRef.current.rotation,
          size: size,
        });
      }
    } else {
      intersectionRef.current = {
        intersects: false,
        point: null,
      };
    }
  };
  const shoot = ({
    position,
    orientation,
    textureScale,
    textureRotation,
    renderOrder,
    decalMap,
  }={}) => {
    try {
      console.log({
        position,
        orientation,
        textureScale,
        textureRotation,
        renderOrder,
        decalMap,
      })
      // const position = new THREE.Vector3();
      // const orientation = new THREE.Euler();
      const size = new THREE.Vector3(10, 10, 10);
      textureRotation || (textureRotation = props.textureRotation);
      textureScale || (textureScale = props.textureScale);
      const mouseHelper = mouseHelperRef.current;
      if(!position){
        position = new THREE.Vector3();
        position.copy(intersectionRef.current.point); 
      }
      let A = new THREE.Vector3(position.x, position.y, position.z);
      let Ax_xy = Math.abs((position.y * RADIUS) / HEIGHT);
      let Ay_xy = position.y;
      let Az_xy = 0;
      let A_xy = new THREE.Vector3(Ax_xy, Ay_xy, Az_xy);
      let square_distance_A_Axy = square_distance3d(
        A_xy.x,
        A_xy.y,
        A_xy.z,
        A.x,
        A.y,
        A.z
      );
      let cos_theta = 1 - square_distance_A_Axy / (2 * A_xy.x ** 2);
      console.log("cos_theta");
      console.log(cos_theta);
      //caculate theta
      let theta =
        A.z > 0 ? Math.acos(cos_theta) : 2 * Math.PI - Math.acos(cos_theta);
      console.log("theta");
      console.log((theta * 180) / Math.PI);
      let theta_unwrap = (theta * RADIUS) / Math.sqrt(HEIGHT ** 2 + RADIUS ** 2);
      console.log("theta_unwrap");
      console.log((theta_unwrap * 180) / Math.PI);
      let distance_OA = Math.abs(
        Math.sqrt(position.x ** 2 + position.y ** 2 + position.z ** 2)
      );
      console.log("distance_OA");
      console.log(distance_OA);
      if(!orientation){
        orientation = new THREE.Euler();
        orientation.copy(mouseHelperRef.current.rotation);
        orientation.z = orientation.z + (textureRotation / 360)*2*Math.PI;
      }
  
      // if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;
      const scale = textureScale;
      size.set(scale, scale, scale);
      const material = getDecalMaterial(decalMap);
      // material.color.setHex(0x000000);
  
      const m = new THREE.Mesh(
        new DecalGeometry(coneMeshRef.current, position, orientation, size),
        material
      );
      m.renderOrder = renderOrder || props.meshInfos.length; // give decals a fixed render order
      console.log(props.savedMeshInfos);
      props.setMeshInfos((old)=>[...old, {
        mesh: m,
        meshId: old.length,
        texture: props.savedMeshInfos[renderOrder]?.texture  || props.texture,
        textureScale: textureScale || props.textureScale,
        textureRotation: textureRotation || props.textureRotation,
        // theta: theta,
        // r: distance_OA,
        x: position.x,
        y: position.y,
        z: position.z,
        o_x: orientation.x,
        o_y: orientation.y,
        o_z: orientation.z,
      }]);
      scene.add(m);
    } catch (error) {
      console.log("error at shoot: ", error);
    }
  };
  const square_distance3d = (x1, y1, z1, x2, y2, z2) => {
    return (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;
  };
  return (
    <>
      <ambientLight intensity={1.25} />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.4} />
      <Suspense fallback={null}>
        <line ref={lineRef}>
          <bufferGeometry ref={lineGeometryRef} />
          <lineBasicMaterial color={0x000000} visible={!isMobile} />
        </line>
        <line>
          <bufferGeometry ref={breakLineRef} />
          <lineBasicMaterial color={0xe90074} />
        </line>
        <mesh ref={previewMeshRef}></mesh>
        <mesh
          position={[0, -HEIGHT / 2, 0]}
          onPointerUp={(e) => {
            if(!isMobile){
                handlePointerUp(e);
            }else{
                handleTouchUp(e);
            }
          }}
          onPointerDown={(e) => {
            if(!isMobile){
                handlePointerDown(e);
            }else{
                handleTouchDown(e);
            }
          }}
          ref={coneMeshRef}
        >
          <coneGeometry
            args={[
              RADIUS,
              HEIGHT,
              RADIUS_SEGMENTS,
              HEIGHT_SEGMENTS,
              OPEN_ENDED,
              THETA_START,
              THETA_LENGTH,
            ]}
          />
          <meshStandardMaterial color="#FFD35A" wireframe />
        </mesh>
        <axesHelper
          args={[AXIS_HEIGHT]}
          setColors={["#ff0000", "#00ff00", "#0000ff"]}
        />
        <mesh visible={false} ref={mouseHelperRef}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Suspense>
      <OrbitControls
        enableZoom={false}
        target={[0, -10, 0]}
        onChange={() => {
          setIsMoving(true);
        }}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 2.5}
      />
    </>
  );
});
export default ConicalHatDesigner;
