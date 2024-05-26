import React from "react";
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
  return (
    <AnimationRevealPage>
      <Header />
      <Hero
        heading={
          <>
            <HighlightedText>Tô nón lá</HighlightedText>
            <br />Tô màu khoảnh khắc
            <br /> Vẽ sắc thời trang
          </>
        }
        description={<><span tw="text-primary-500">Tô nón lá</span> là nơi giúp bạn trải nghiệm trang trí chiếc nón lá Việt Nam, tạo ra Sản phẩm thời trang mang Văn hoá Việt và Dấu ấn của riêng bạn.</>}
        imageSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
        imageCss={imageCss}
        imageDecoratorBlob={true}
        primaryButtonText="Tìm hiểu ngay"
        // watchVideoButtonText="Meet The Chefs"
      />
      //Video giới thiệu: Nguyên liệu, trải nghiệm, thành phẩm. Nhấn mạnh vào
      trải nghiệm một mình hoặc với gia đình, bạn bè; có thể sử dụng để đội,
      trang trí hoặc làm quà tặng.
      <VideoFrame>
        <StyledResponsiveVideoEmbed
          url="https://www.youtube.com/embed/fVGgOCFzaqQ?si=3LsGbpSkMsZkvCok"
          background="transparent"
        />
      </VideoFrame>
      //Giới thiệu quy trình: //Đặt qua web: 1. Chọn mẫu nón lá: kích thước,
      thiết kế, 2. Đặt lịch, confirm từ Tô nón lá 3. Trải nghiệm //Sau này nếu
      có cửa hàng: 1. Chọn mẫu nón lá: kích thước, thiết kế, 2. Trải nghiệm
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
            1. Vào trang web <span tw="text-primary-500">tononla.com</span>
            <br />
            2. Chọn mẫu thiết kế bạn yêu thích
            <br />
            3. Đặt hàng và xác nhận với <span tw="text-primary-500">Tô nón lá</span>
            <br />
            4. Chúng tớ sẽ chuẩn bị, việc của bạn là đến và tô
            <br/>
            <span tw="text-primary-500 text-base"><span tw="font-bold">Thời gian:</span> Chủ nhật hằng tuần</span>
            <br/>
            <span tw="text-primary-500 text-base text-red-500"><span tw="font-bold">Địa điểm:</span> CHƯA BIẾT </span>
          </Description>
        }
        buttonRounded={false}
        textOnLeft={false}
        primaryButtonText="Trải nghiệm ngay"
        imageSrc={
          "https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
        }
        imageCss={imageCss}
        imageDecoratorBlob={true}
        imageDecoratorBlobCss={tw`left-1/2 -translate-x-1/2 md:w-32 md:h-32 opacity-25`}
      />
      {/* TabGrid Component also accepts a tabs prop to customize the tabs and its content directly. Please open the TabGrid component file to see the structure of the tabs props.*/}
      <TabGrid
        heading={
          <>
            <HighlightedText>Sản phẩm</HighlightedText> của <span tw="text-primary-500">Tô nón lá</span>
          </>
        }
      />
      <Footer />
    </AnimationRevealPage>
  );
};
