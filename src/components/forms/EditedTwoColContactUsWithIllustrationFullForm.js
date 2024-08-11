import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-center max-w-screen-xl mx-auto pb-10 md:py-10`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)(props => [
  tw`md:w-5/12 mt-0 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;
const ErrorMessage = tw.div`lg:py-8 text-center md:text-left text-red-600`;
const InfoMessage = tw.div`lg:py-8 text-center md:text-left text-green-600`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(SectionHeading)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`

const Form = tw.div`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}
`

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8 disabled:bg-opacity-50`
const CardContainer = tw.div`mt-10 w-full sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.div)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButtonBase)`text-sm`;

const CardReview = tw.div`font-medium text-xs text-gray-600`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;
export default ({
  subheading = "Contact Us",
  heading = <span tw="text-primary-500">Đặt chỗ</span>,
  description = (
    <>
      <span tw="text-primary-500 text-base">
        <span tw="font-bold">Thời gian:</span> Chủ nhật hằng tuần
      </span>
      <br />
      <span tw="text-primary-500 text-base">
        <span tw="font-bold">Địa điểm:</span> Sẽ được cập nhật trên{" "}
        <a
          href="https://www.facebook.com/profile.php?id=61558483040026"
          tw="font-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fanpage của Tô nón lá
        </a>
      </span>
      <br />
      <span tw="text-primary-500 text-base">
        <span tw="font-bold">Liên hệ:</span> {"0395.188.258"}
      </span>
    </>
  ),
  submitButtonText = "Send",
  formAction = "#",
  formMethod = "get",
  formEndpoint = process.env.REACT_APP_BACKEND_URL
    ? `${process.env.REACT_APP_BACKEND_URL}/orders`
    : "https://default/orders",
  textOnLeft = true,
  state = {},
}) => {
  const { designId = "" } = state;
  // The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
  const handleOnSubmit = async () => {
    setIsError(false);
    if (!phoneNumber) {
      setIsError(true);
      setErrorMessage(
        "Bạn hãy điền số điện thoại để chúng tớ có thể xác nhận lại nhé!"
      );
      return;
    }
    axios
      .post(formEndpoint, {
        phoneNumber,
        name,
        email,
        note,
        designId: designId,
      })
      .then((res) => {
        if (res.status == 201) {
          setSubmitSuccessfully(true);
          window.fbq("track", "Purchase", {
            // content_name: productName,
            // content_ids: [productId],
            // content_type: productType,
            // contents: [{
            //   id: productId,
            //   quantity: numItems
            // }],
            // num_items: numItems,
            // currency: currency,
            // value: value
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitSuccessfully, setSubmitSuccessfully] = useState(false);
  return (
    <Container>
      <TwoColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {/* {subheading && <Subheading>{subheading}</Subheading>} */}
            <Heading>{heading}</Heading>
            {description && <Description>{description}</Description>}
            <Form>
              {isError ? <ErrorMessage>{errorMessage}</ErrorMessage> : ""}
              {submitSuccessfully ? (
                <InfoMessage>{"Đặt chỗ thành công"}</InfoMessage>
              ) : (
                ""
              )}
              <Input
                type="text"
                name="phone"
                required
                placeholder="Số điện thoại (Bắt buộc)"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
              <Input
                type="text"
                name="name"
                placeholder="Tên bạn là gì"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email (Nhận thông tin mới nhất qua email)"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
              <Textarea
                name="message"
                placeholder="Bạn muốn lưu ý điều gì cho chúng tớ không?"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
              <SubmitButton
                type="submit"
                onClick={() => {
                  handleOnSubmit();
                }}
                disabled={submitSuccessfully}
              >
                {submitButtonText}
              </SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
