import React, { useEffect, useRef, useState } from "react";
import ConicalHatDesignerCanvas from "./ConicalHatDesignerCanvas";
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import "./DesignConicalHatApp.css";
import Button from "@mui/material/Button";
import {
  Checkbox,
  FormControlLabel,
  Stack,
  Modal,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import InputSlider from "./InputSlider";
import { Rotate90DegreesCcw, ZoomIn } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function DesignConicalHatApp() {
  const [textureScale, setTextureScale] = useState(5);
  const [textureRotation, setTextureRotation] = useState(0);
  const [texture, setTexture] = useState({
    id: 0,
    name: "Logo",
    imageUrl: "/logo_circle.png",
    thumbnailUrl: "/logo_circle.png",
  });
  const [textures, setTextures] = useState([
    {
      id: 0,
      name: "Logo",
      imageUrl: "/logo_circle.png",
      thumbnailUrl: "/logo_circle.png",
    }
  ]);
  const [meshInfos, setMeshInfos] = useState([]); // data: {mesh, meshId, textureImage}
  const [savedMeshInfos, setSavedMeshInfos] = useState([]);
  const [selectedMeshId, setSelectedMeshId] = useState(null);
  const [selectedTextureIndex, setSelectedTextureIndex] = useState(0);
  const meshInfosRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState(0); // 0: drag mode, 1: draw mode
  const [isSaved, setIsSaved] = useState(true);
  const navigate = useNavigate();
  const primaryButtonUrl = "/components/landingPages/Checkout";
  const handleGotoCheckout = (designId)=>{
    navigate(primaryButtonUrl, {
      state:{
        designId: designId
      }
    });
    window.fbq('track', 'InitiateCheckout');
  }
  //check if mobile screen then hide mouse, otherwise show mouse
  useEffect(() => {
    loadData();
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const loadData = async () => {
    try {
      const getTexturesEndpoint = process.env.REACT_APP_BACKEND_URL?`${process.env.REACT_APP_BACKEND_URL}/textures`:"https://default/textures";
      const response = await axios.get(getTexturesEndpoint);
      const newTextures = [...textures, ...response.data];
      setTextures(newTextures);
      //get localstorage data, get meshInfos
      const data = localStorage.getItem("meshInfos");
      if (data) {
        const meshInfos = JSON.parse(data);
        //add texture to meshInfos
        meshInfos.forEach((meshInfo) => {
          const texture = newTextures.find(
            (texture) => texture.id === meshInfo.textureId
          );
          meshInfo.texture = texture;
        });
        setSavedMeshInfos(meshInfos);
      }
    } catch (error) {
      console.error(`Error at fetch textures: ${error}`);
    }
  };
  useEffect(() => {
    setIsSaved(false);
  }, [meshInfos.length]);
  const [openedModal, setOpenedModal] = React.useState(false);
  const handleOpenModal = () => setOpenedModal(true);
  const handleCloseModal = () => setOpenedModal(false);
  const handleDrawTexture = () => {
    console.log("draw texture");
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleSave = () => {
    //save to local storage: meshId, scale, rotation, theta, r
    const data = meshInfos.map((meshInfo) => {
      return {
        meshId: meshInfo.meshId,
        textureId: meshInfo.texture.id,
        scale: meshInfo.textureScale,
        rotation: meshInfo.textureRotation ,//* (180/Math.PI),
        x: meshInfo.x,
        y: meshInfo.y,
        z: meshInfo.z,
        o_x: meshInfo.o_x,
        o_y: meshInfo.o_y,
        o_z: meshInfo.o_z,
      };
    });
    localStorage.setItem("meshInfos", JSON.stringify(data));
    setIsSaved(true);
  };
  const handleSaveAndOrder = async () => {
    //save to local storage first
    //call api to save design
    //redirect to order page
    handleSave();
    if (meshInfos.length === 0) {
      alert("Bạn chưa vẽ gì cả!");
      return;
    }
    const getTexturesEndpoint = process.env.REACT_APP_BACKEND_URL?`${process.env.REACT_APP_BACKEND_URL}/designs`:"https://default/textures";
    const data = meshInfos.map((meshInfo) => {
      return {
        meshId: meshInfo.meshId,
        textureId: meshInfo.texture.id,
        scale: meshInfo.textureScale,
        rotation: meshInfo.textureRotation,
        x: meshInfo.x,
        y: meshInfo.y,
        z: meshInfo.z,
        o_x: meshInfo.o_x,
        o_y: meshInfo.o_y,
        o_z: meshInfo.o_z,
      };
    });
    const response = await axios.post(getTexturesEndpoint,{
      name: "Design",
      type: "custom",
      group: "custom",
      description: "Custom design",
      data: JSON.stringify(data),
      order: 0,
      isShow: false,
    });
    const designId = response.data.id;
    handleGotoCheckout(designId);
  }
  return (
    <AnimationRevealPage disabled={true}>
      <Header></Header>
      <Stack
        direction={"column"}
        spacing={2}
        padding={1}
        paddingBottom={5}
        // justifyContent={"center"}
        alignItems={"center"}
      >
        <ConicalHatDesignerCanvas
          width="100%"
          height="400px"
          backgroundColor="#f5f5f5"
          textureScale={textureScale}
          textureRotation={textureRotation}
          texture={texture}
          isMobile={isMobile}
          mobileMode={mobileMode}
          meshInfos={meshInfos}
          savedMeshInfos={savedMeshInfos}
          setMeshInfos={setMeshInfos}
          selectedMeshId={selectedMeshId}
          ref={meshInfosRef}
        />
        <Paper variant="outlined" square={false} style={{padding:'1rem'}}>
          <>
          <div>1. Chọn hoạ tiết tại "Danh sách hoạ tiết"</div>
          </>
          {isMobile ? (
            <>
              <div>2. Chạm vào nón để hiện ra hình tạm thời</div>
              <div>3. Vẽ: Đặt vào vị trí thích hợp, nhấn nút "Nhấn để vẽ"</div>
            </>
          ) : (
            <>
            <div>2. Di chuyển chuột trên bề mặt nón để hiện ra hình tạm thời</div>
            <div>3. Vẽ: Di chuyển hình tạm thời vào vị trí thích hợp, nhấn chuột trái để vẽ</div>
            </>
          )}
          <>
          <div>4. Xoá: Chọn hoạ tiết muốn xoá ở mục Hoạ tiết đã vẽ. Bấm nút xoá</div>
          </>

        </Paper>
        <Stack
          className="options"
          direction={"row"}
          justifyContent={"space-around"}
          gap={2}
        >
          <Button
            variant="contained"
            onClick={handleOpenModal}
            style={{
              background:
                "linear-gradient(21deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
              color: "black",
            }}
          >
            Danh sách hoạ tiết
          </Button>
          {isMobile ? (
            <>
              <Button
                variant="contained"
                onClick={() => {
                  meshInfosRef.current.shootPreview();
                }}
              >
                Nhấn để vẽ
              </Button>
            </>
          ) : null}
        </Stack>
        <Stack direction={"row"} columnGap={"20px"} flexWrap={"wrap"}>
          <InputSlider
            value={textureScale}
            setValue={setTextureScale}
            label="Kích thước hoạ tiết"
            min={5}
            max={10}
            step={1}
            icon={<ZoomIn />}
          ></InputSlider>
          {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
          <InputSlider
            value={textureRotation}
            setValue={setTextureRotation}
            label="Xoay hoạ tiết"
            min={0}
            max={360}
            step={1}
            icon={<Rotate90DegreesCcw />}
          ></InputSlider>
        </Stack>
        <Stack
          className="mesh_list_horizontal_container"
          width={"100%"}
          maxWidth={"500px"}
          direction={"column"}
          rowGap={2}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography id="input-slider" gutterBottom={false}>
              Hoạ tiết đã vẽ
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                meshInfosRef.current.removeAllMeshInfo();
                setSelectedMeshId(null);
              }}
            >
              Xóa tất cả
            </Button>
          </Stack>
          <Stack
            className="mesh_list"
            direction={"row"}
            gap={1}
            justifyContent={"flex-start"}
            alignItems={"center"}
            flexWrap={"nowrap"}
            overflow={"scroll"}
            minHeight={"70px"}
            minWidth={"100%"}
            borderRadius={"5px"}
            border={"1px solid #ccc"}
          >
            {meshInfos?.map((meshInfo, index) => (
              <div
                className={`mesh_item ${
                  meshInfo.meshId === selectedMeshId ? "selected" : ""
                }`}
                key={index}
                style={{ minWidth: "fit-content" }}
              >
                <img
                  src={meshInfo?.texture?.thumbnailUrl}
                  alt={meshInfo.meshId}
                  style={{ width: "50px", height: "50px" }}
                  onClick={() => {
                    if (selectedMeshId === meshInfo.meshId) {
                      setSelectedMeshId(null);
                    } else {
                      setSelectedMeshId(meshInfo.meshId);
                    }
                  }}
                />
              </div>
            ))}
          </Stack>
        </Stack>
        {selectedMeshId || selectedMeshId === 0 ? (
          <>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (selectedMeshId || selectedMeshId === 0) {
                  meshInfosRef.current.removeMeshInfo(selectedMeshId);
                  setSelectedMeshId(null);
                }
              }}
            >
              Xoá hoạ tiết
            </Button>
          </>
        ) : null}
        <Stack flexDirection={"row"} columnGap={2} justifyContent={"center"}>
          <Button variant="outlined" onClick={handleSave} disabled={isSaved}>
            Lưu
          </Button>
          <Button variant="contained" onClick={handleSaveAndOrder}>
            Lưu và Đặt hàng
          </Button>
        </Stack>
      </Stack>
      <Footer></Footer>
      <Modal
        open={openedModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} display={'flex'} flexDirection={'column'} alignItems={"center"} rowGap={'10'}>
          <div className="texture_list_hoirizontal_container">
            <label>Danh sách hoạ tiết</label>
            <div className="texture_list">
              {textures.map((texture, index) => (
                <div
                  className={`texture_item ${
                    selectedTextureIndex == index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={texture.thumbnailUrl}
                    alt={texture.name}
                    style={{ width: "50px", height: "50px" }}
                    onClick={() => {
                      setTexture(texture);
                      if (selectedTextureIndex === index) {
                        setSelectedTextureIndex(null);
                      } else {
                        setSelectedTextureIndex(index);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleCloseModal} variant="contained">
            Chọn
          </Button>
        </Box>
      </Modal>
    </AnimationRevealPage>
  );
}

export default DesignConicalHatApp;
