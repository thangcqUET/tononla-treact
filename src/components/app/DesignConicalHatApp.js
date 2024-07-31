import React, { useEffect, useRef, useState } from "react";
import ConicalHatDesignerCanvas from "./ConicalHatDesignerCanvas";
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
} from "@mui/material";
import InputSlider from "./InputSlider";
import { Rotate90DegreesCcw, ZoomIn } from "@mui/icons-material";
function DesignConicalHatApp() {
  const [textureScale, setTextureScale] = useState(5);
  const [textureRotation, setTextureRotation] = useState(0);
  const [textureImage, setTextureImage] = useState("/focus.png"); //TODO: default image is tononla logo
  const textureImageList = ["/focus.png", "/logo512.png"];
  const [meshInfos, setMeshInfos] = useState([]); // data: {mesh, meshId, textureImage}
  const [selectedMeshId, setSelectedMeshId] = useState(null);
  const [selectedTextureIndex, setSelectedTextureIndex] = useState(null);
  const meshInfosRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState(0); // 0: drag mode, 1: draw mode
  //check if mobile screen then hide mouse, otherwise show mouse
  useEffect(() => {
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

  const [openedModal, setOpenedModal] = React.useState(false);
  const handleOpenModal = () => setOpenedModal(true);
  const handleCloseModal = () => setOpenedModal(false);
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
  return (
    <>
      <Stack
        direction={"column"}
        spacing={2}
        padding={1}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <ConicalHatDesignerCanvas
          width="100%"
          height="400px"
          backgroundColor="#f5f5f5"
          textureScale={textureScale}
          textureRotation={textureRotation / 360}
          textureImage={textureImage}
          isMobile={isMobile}
          mobileMode={mobileMode}
          meshInfos={meshInfos}
          setMeshInfos={setMeshInfos}
          selectedMeshId={selectedMeshId}
          ref={meshInfosRef}
        />
        <Stack
          className="options"
          direction={"row"}
          justifyContent={"space-around"}
        >
          {isMobile ? (
            <div className="mobile_mode_container">
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Bật để vẽ"
                checked={mobileMode === 1}
                onChange={() => {
                  setMobileMode(1 - mobileMode);
                }}
              />
            </div>
          ) : null}
          <Button
            variant="outlined"
            onClick={handleOpenModal}
            style={{
              background:
                "linear-gradient(21deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
              color: "black",
            }}
          >
            Danh sách hoạ tiết
          </Button>
        </Stack>
        <Stack direction={"row"} columnGap={"20px"} flexWrap={"wrap"}>
          <InputSlider
            value={textureScale}
            setValue={setTextureScale}
            label="Kích thước hoạ tiết"
            min={1}
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
              Danh sách hoạ tiết đã vẽ lên nón
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
              >
                <img
                  src={meshInfo.textureImage}
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
              Delete
            </Button>
          </>
        ) : null}
      </Stack>
      <Modal
        open={openedModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div className="texture_list_hoirizontal_container">
            <label>Danh sách hoạ tiết</label>
            <div className="texture_list">
              {textureImageList.map((textureImage, index) => (
                <div
                  className={`texture_item ${
                    selectedTextureIndex == index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={textureImage}
                    alt={textureImage}
                    style={{ width: "50px", height: "50px" }}
                    onClick={() => {
                      setTextureImage(textureImage);
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
        </Box>
      </Modal>
    </>
  );
}

export default DesignConicalHatApp;
