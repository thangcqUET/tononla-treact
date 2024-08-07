import React, { forwardRef, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithVideo.js";
import Features from "components/features/ThreeColSimple.js";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColSingleFeatureWithStats2.js";
import TabGrid from "components/cards/EditedTabCardGrid.js";
import Testimonial from "components/testimonials/ThreeColumnWithProfileImage.js";
import DownloadApp from "components/cta/DownloadApp.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import chefIconImageSrc from "images/chef-icon.svg";
import celebrationIconImageSrc from "images/celebration-icon.svg";
import shopIconImageSrc from "images/shop-icon.svg";
import styled from "styled-components";
import ResponsiveVideoEmbed from "../helpers/ResponsiveVideoEmbed.js";
import axios from "axios";
const StyledResponsiveVideoEmbed = styled(ResponsiveVideoEmbed)`
  padding-bottom: 56.25% !important;
  padding-top: 0px !important;
  ${tw`rounded`}
  iframe {
    ${tw`rounded bg-black shadow-xl`}
  }
`;
export default () => {
  const Subheading = tw.span`tracking-wider text-sm font-medium`;
  const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
  const HighlightedTextInverse = tw.span`bg-gray-100 text-primary-500 px-4 transform -skew-x-12 inline-block`;
  const Description = tw.span`inline-block mt-8`;
  const VideoFrame = tw.div`pt-6 pb-6 mx-auto max-w-screen-xl`;
  const imageCss = tw`rounded-4xl`;
  const refVideo = useRef();
  const refProductList = useRef();
  const refHow = useRef();
  const handleScroll = (ref)=>{
    return ()=>{
      ref.current?.scrollIntoView({behavior: 'smooth'});
    }
  }
  const [products, setProducts] = useState([]);
  //useeffect to load data: list products
  useEffect(()=>{
    //fetch data
    const getProductsEndpoint = process.env.REACT_APP_BACKEND_URL?`${process.env.REACT_APP_BACKEND_URL}/products`:"https://default/products";
    axios.get(getProductsEndpoint).then((response)=>{
      //convert data to other format: tabs = {tabName: [{title, content, imageSrc, price, rating, reviews, id}]}
      //from [{id, name, type, imageUrl, order}] to {type: [{title, imageSrc, id}]}
      const products = response.data.reduce((acc, design)=>{
        let typeAll = 'Tất cả';
        let type = design.type?.charAt(0).toUpperCase() + design.type.slice(1);
        if(!acc[typeAll]){
          acc[typeAll] = [];
        }
        if(!acc[type]){
          acc[type] = [];
        }
        let p = {};
        //convert field name
        p.title = design.name?.charAt(0).toUpperCase() + design.name.slice(1);
        p.imageSrc = design.imageUrl||'https://source.unsplash.com/random';
        p.id = design.id;
        p.price = design.price||70000;
        p.compareAtPrice = design.compareAtPrice;
        p.currency = design.unit||'VND';
        p.type = type;
        p.description = design.description;
        p.quantity = design.quantity||0;
        acc[type].push(p);
        acc[typeAll].push(p);
        return acc;
      }, {});
      setProducts(products);
    }).catch((error)=>{
      console.log(`Error at fetch products: ${error}`);
    });
  }, []);
  return (
    <>
      <AnimationRevealPage disabled={true}>
        <Header
          navFunctions={[handleScroll(refHow), handleScroll(refProductList)]}
        />
        <Hero
          heading={
            <>
              <HighlightedText>Tô nón lá</HighlightedText>
              <br />
              Tô màu khoảnh khắc
              <br /> Vẽ sắc thời trang
            </>
          }
          description={
            <>
              <span tw="text-primary-500">Tô nón lá</span> là nơi giúp bạn trải
              nghiệm trang trí chiếc nón lá Việt Nam, tạo ra Sản phẩm thời trang
              mang Văn hoá Việt và Dấu ấn của riêng bạn.
            </>
          }
          imageSrcs={[
            "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/No%CC%81n%20Khue%CC%82%20Va%CC%86n%20Ca%CC%81c.webp",
            "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/No%CC%81n%20cho%CC%9B%CC%A3%20Be%CC%82%CC%81n%20Tha%CC%80nh.webp",
            "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/No%CC%81n%20chu%CC%80a%20Ca%CC%82%CC%80u.webp",
            "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/No%CC%81n%20co%CC%9B%CC%80%20Vie%CC%A3%CC%82t%20Nam.webp",
            "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/No%CC%81n%20hoa%20sen.webp",
        ]}
          imageCss={imageCss}
          imageDecoratorBlob={true}
          primaryButtonText="Tìm hiểu ngay"
          buttonFunction={handleScroll(refVideo)}
          // watchVideoButtonText="Meet The Chefs"
        />
        <VideoFrame
          ref={refVideo}
          onClick={() => {
            window.fbq("track", "ButtonClick", {
              content_name: "Video:Play_or_Pause",
            });
          }}
        >
          <StyledResponsiveVideoEmbed
            url="https://www.youtube.com/embed/zS0o_62Vnz0?si=tF8nlKabbAAbVvTe"
            background="transparent"
          />
        </VideoFrame>
        <div ref={refHow}>
          <MainFeature
            subheading={""}
            heading={
              <>
                Tô nón lá
                <br />
                <HighlightedText>như thế nào</HighlightedText>
              </>
            }
            description={
              <Description>
                1. Vào trang web <span tw="text-primary-500"><a href="www.tononla.com">www.tononla.com</a></span>
                <br />
                2. Chọn mẫu thiết kế bạn yêu thích
                <br />
                3. Đặt chỗ và xác nhận với{" "}
                <span tw="text-primary-500">Tô nón lá</span>
                <br />
                4. Chúng tớ sẽ chuẩn bị, việc của bạn là đến và tô
                <br />
                <span tw="text-primary-500 text-base">
                  <span tw="font-bold">Thời gian:</span> Chủ nhật hằng tuần
                </span>
                <br />
                <span tw="text-primary-500 text-base">
                  <span tw="font-bold">Địa điểm:</span> Sẽ được cập nhật trên <a href="https://www.facebook.com/profile.php?id=61558483040026" tw="font-bold">Fanpage của Tô nón lá</a>
                </span>
                <br />
                <span tw="text-primary-500 text-base">
                  <span tw="font-bold">Liên hệ:</span> {"0395.188.258"}
                </span>
              </Description>
            }
            buttonRounded={false}
            textOnLeft={false}
            primaryButtonText="Trải nghiệm ngay"
            buttonFunction={() => {
              handleScroll(refProductList)();
              window.fbq("track", "ButtonClick", {
                content_name: "Progress:Trai_nghiem_ngay",
              });
            }}
            imageSrc={
              "https://ipfs.filebase.io/ipfs/QmTibKpU6MkJ9nbJFhBYvyiSYUR9Xy6Lru4iNjQsD3JzUF/IMG_4496%20%283%29.webp"
            }
            imageCss={imageCss}
            imageDecoratorBlob={true}
            imageDecoratorBlobCss={tw`left-1/2 -translate-x-1/2 md:w-32 md:h-32 opacity-25`}
          />
        </div>
        {/* TabGrid Component also accepts a tabs prop to customize the tabs and its content directly. Please open the TabGrid component file to see the structure of the tabs props.*/}
        <div ref={refProductList}>
          <TabGrid
            heading={
              <>
                <HighlightedText>Sản phẩm</HighlightedText> của{" "}
                <span tw="text-primary-500">Tô nón lá</span>
              </>
            }
            tabs={products}
          />
        </div>
        <Footer />
      </AnimationRevealPage>
    </>
  );
};
