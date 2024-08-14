import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { motion } from "framer-motion";
const PrimaryButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-primary-500 text-gray-100 hocus:bg-primary-700 focus:shadow-outline focus:outline-none transition duration-300`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const Card = tw(
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url("${props.imageSrc}");
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
export default function ConicalHatPreview({
  imageSrc = "",
  name = "Template Name",
  designData = {},
}) {
  return (
    <CardContainer>
      <Card className="group" initial="rest" whileHover="hover" animate="rest">
        <CardImageContainer imageSrc={imageSrc}></CardImageContainer>
        <CardText>
            <CardTitle>{name}</CardTitle>
        </CardText>
        <PrimaryButton
          style={{ width: "100%", marginTop: "10px" }}
          onClick={() => {
            // update local storage
            localStorage.setItem("meshInfos", JSON.stringify(designData));
            window.open("/design-app", "_blank");
          }}
        >
          Sử dụng mẫu này
        </PrimaryButton>
      </Card>
    </CardContainer>
  );
}
