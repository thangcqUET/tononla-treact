import React, { useEffect, useRef, useState } from "react";
import ConicalHatDesignerCanvas from "./ConicalHatDesignerCanvas";
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import "./DesignConicalHatApp.css";
import Button from "@mui/material/Button";
import tracking from "../../tracking/GTM";
import {
  Checkbox,
  FormControlLabel,
  Stack,
  Modal,
  Box,
  Typography,
  Divider,
  Paper,
  Chip,
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
      minScale: 5,
      maxScale: 10,
    }
  ]);
  const [templates, setTemplates] = useState([]);
  const [textureTypes, setTextureTypes] = useState([]);
  const [selectedTextureType, setSelectedTextureType] = useState(null);
  const [meshInfos, setMeshInfos] = useState([]); // data: {mesh, meshId, textureImage}
  const [savedMeshInfos, setSavedMeshInfos] = useState([]);
  const [selectedMeshId, setSelectedMeshId] = useState(null);
  const [selectedTextureIndex, setSelectedTextureIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
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
      const getTemplatesEndpoint = process.env.REACT_APP_BACKEND_URL?`${process.env.REACT_APP_BACKEND_URL}/templates`:"https://default/templates";
      //get template id from url
      const templateId = new URLSearchParams(window.location.search).get("templateId");
      console.log("templateId", templateId);
      let getTemplateEndpoint = null;
      let templateResponsePr = null;
      if (templateId) {
        getTemplateEndpoint = process.env.REACT_APP_BACKEND_URL?`${process.env.REACT_APP_BACKEND_URL}/templates/${templateId}`:"https://default/templates";
        console.log("getTemplateEndpoint", getTemplateEndpoint);
        templateResponsePr = axios.get(getTemplateEndpoint);
      }
      const texturesResponsePr = axios.get(getTexturesEndpoint);
      const templatesResponsePr = axios.get(getTemplatesEndpoint);
      //use promise all settle
      const [templateResponse, texturesResponse, templatesResponse] = await Promise.allSettled([
        templateResponsePr,
        texturesResponsePr,
        templatesResponsePr,
      ]);
      const templateValue = templateResponse.value;
      const texturesValue = texturesResponse.value;
      const templatesValue = templatesResponse.value;
      const newTextures = [...textures, ...texturesValue.data];
      setTextures(newTextures);
      setTemplates(templatesValue.data);
      const newTextureTypes = Array.from(new Set(newTextures.map((texture) => texture.type)));
      setTextureTypes(newTextureTypes);
      //get localstorage data, get meshInfos if templateResponse is not null or undefined
      if (templateValue && templateValue?.data?.designData) {
        const template = templateValue.data;
        //check if template is object or string
          
        const meshInfos = JSON.parse(template.designData);
        //add texture to meshInfos
        meshInfos.forEach((meshInfo) => {
          const texture = newTextures.find(
            (texture) => texture.id === meshInfo.textureId
          );
          meshInfo.texture = texture;
        });
        setSavedMeshInfos(meshInfos);
      }else{
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
      }
    } catch (error) {
      console.error(`Error at fetch textures: ${error}`);
    }
  };
  useEffect(() => {
    setIsSaved(false);
  }, [meshInfos.length]);
  const [openedTextureListModal, setOpenedTextureListModal] = React.useState(false);
  const [openedTemplateListModal, setOpenedTemplateListModal] = React.useState(checkIsFirstTime());
  const handleOpenTextureListModal = () => {
    tracking.clickToOpenSelectingTextureOnDesignApp();
    setOpenedTextureListModal(true);
  }
  const handleCloseTextureListModal = () => {
    setOpenedTextureListModal(false);
  }
  const handleOpenTemplateListModal = () => {
    tracking.clickToOpenSelectingTemplateOnDesignApp();
    setOpenedTemplateListModal(true);
  }
  const handleCloseTemplateListModal = () => {
    setOpenedTemplateListModal(false);
  }
  const handleGoToTemplate = () => {
    tracking.clickToSelectTemplateOnDesignApp(selectedTemplateId);
    window.location.replace(`/design-app?templateId=${selectedTemplateId}`)
  };
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
  function checkIsFirstTime() {
    const isFirstTime = localStorage.getItem("isFirstTime");
    if (!isFirstTime) {
      localStorage.setItem("isFirstTime", "false");
      return true;
    }
    return false;
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
          setSavedMeshInfos={setSavedMeshInfos}
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
              <div>3. <span style={{color:"#1976d2"}}>Vẽ</span>: Đặt vào vị trí thích hợp, nhấn nút "Nhấn để vẽ"</div>
            </>
          ) : (
            <>
            <div>2. Di chuyển chuột trên bề mặt nón để hiện ra hình tạm thời</div>
            <div>3. <span style={{color:"#1976d2"}}>Vẽ</span>: Di chuyển hình tạm thời vào vị trí thích hợp, nhấn chuột trái để vẽ</div>
            </>
          )}
          <>
          <div>4. <span style={{color:"#d32f2f"}}>Xoá</span>: Chọn hoạ tiết muốn xoá ở mục Hoạ tiết đã vẽ. Bấm nút xoá</div>
          </>

        </Paper>
        <Stack
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={2}
        >
          <Stack
          className="options"
          direction={"row"}
          justifyContent={"space-around"}
          gap={2}
          >
            <Button
              variant="contained"
              onClick={handleOpenTextureListModal}
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
                    tracking.clickPressToDrawOnDesignApp(texture.id);
                    meshInfosRef.current.shootPreview();
                  }}
                >
                  Nhấn để vẽ
                </Button>
              </>
            ) : null}
          </Stack>

          <Button
            variant="outlined"
            onClick={handleOpenTemplateListModal}
            style={{
              // background:
              //   "linear-gradient(21deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
              // color: "black",
              width: "100%",
            }}
          >
            Mẫu có sẵn
          </Button>
        </Stack>
        <Stack direction={"row"} columnGap={"20px"} flexWrap={"wrap"}>
          <InputSlider
            value={textureScale}
            setValue={(size)=>{
              tracking.clickToResizeTextureOnDesignApp(texture.id, size);
              setTextureScale(size)
            }}
            label="Kích thước hoạ tiết"
            min={texture?.minScale || 5}
            max={texture?.maxScale || 10}
            step={1}
            icon={<ZoomIn />}
          ></InputSlider>
          {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
          <InputSlider
            value={textureRotation}
            setValue={(degree)=>{
              tracking.clickToRotateTextureOnDesignApp(texture.id, degree);
              setTextureRotation(degree);
            }}
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
                tracking.clickToRemoveAllTextureOnDesignApp();
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
                  tracking.clickToRemoveTextureOnDesignApp(meshInfos[selectedMeshId]?.texture?.id||null);
                  meshInfosRef.current.removeMeshInfo(selectedMeshId);
                  setSelectedMeshId(null);
                }
              }}
            >
              Xoá hoạ tiết
            </Button>
          </>
        ) : null}
        <Stack 
        flexDirection={"row"} 
        columnGap={2} 
        justifyContent={"center"}
        position={isMobile?"fixed":"relative"}
        backgroundColor={isMobile?"rgb(245 245 245)":null}
        width={"100%"}
        padding={"1rem"}
        bottom={0}
        zIndex={100}
        >
          <Button variant="outlined" onClick={
            ()=>{
              tracking.clickToSaveDesignOnDesignApp();
              handleSave()
            }}
            disabled={isSaved}>
            Lưu
          </Button>
          <Button variant="contained" onClick={()=>{
            tracking.clickToSaveAndOrderOnDesignApp();
            handleSaveAndOrder();
          }}>
            Lưu và Đặt chỗ
          </Button>
        </Stack>
      </Stack>
      <Footer></Footer>
      <Modal
        open={openedTextureListModal}
        onClose={handleCloseTextureListModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} display={'flex'} flexDirection={'column'} alignItems={"center"} rowGap={'10'}>
          <Stack
            direction={"column"}
            gap={2}
            alignItems={"center"}
          >
            <label>Danh sách hoạ tiết</label>
            <div className="texture_list_hoirizontal_container">
              <div className="texture_type_list">
                {textureTypes.map((type, index) => {
                  if(!type) return null;
                  return <Chip 
                  key={index} 
                  label={type||"Hoạ tiết"} 
                  onClick={() => {
                    if(selectedTextureType && selectedTextureType === type){
                      setSelectedTextureType(null);
                    }else{
                      tracking.clickToSelectTextureTypeOnDesignApp(type);
                      setSelectedTextureType(type);
                    }
                    setSelectedTextureIndex(0);
                  }}
                  variant={`${selectedTextureType === type ? "filled" : "outlined"}`}
                  color="primary"
                  />;
                })}
              </div>
              <div className="texture_list">
                {textures.filter((texture) => {
                    if (!selectedTextureType) return true;
                    return texture.type === selectedTextureType;
                  }).map((texture, index) => (
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
                          //set texture scale to min scale
                          setTextureScale(texture.minScale);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={()=>{
              tracking.clickToSelectTextureOnDesignApp(texture.id);
              handleCloseTextureListModal();
            }} 
            variant="contained">
              Chọn
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={openedTemplateListModal}
        onClose={()=>{
          tracking.clickToCloseSelectingTemplateOnDesignApp();
          handleCloseTemplateListModal();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} display={'flex'} flexDirection={'column'} alignItems={"center"} rowGap={'10'}>
          <Stack
            direction={"column"}
            gap={2}
            alignItems={"center"}
          >
            <label>Mẫu có sẵn</label>
            <div className="template_list_hoirizontal_container">
              <div className="template_list">
                {templates.map((template, index) => (
                  <div
                    className={`template_item ${
                      selectedTemplateId == template.id ? "selected" : ""
                    }`}
                    key={template.id}
                    style={{ width: "100px"}}
                  >
                    <img
                      src={template.imageUrl}
                      alt={texture.name}
                      style={{ width: "100px", height: "100px" }}
                      onClick={() => {
                        if (selectedTemplateId === template.id) {
                          setSelectedTemplateId(null);
                        } else {
                          setSelectedTemplateId(template.id);
                        }
                      }}
                    />
                    <p>{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <Stack
              direction={"row"}
              gap={2}
              justifyContent={"center"}
            >
              <Button onClick={()=>{
                  tracking.clickToSelectBlankTemplateOnDesignApp();
                  handleCloseTemplateListModal();
                }} variant="outlined">
                Tự thiết kế
              </Button>
              <Button onClick={()=>{
                tracking.clickToSelectTemplateOnDesignApp(selectedTemplateId);
                handleGoToTemplate();
              }} variant="contained">
                Sử dụng mẫu này
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </AnimationRevealPage>
  );
}

export default DesignConicalHatApp;
