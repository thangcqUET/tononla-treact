import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { css } from "styled-components/macro"; //eslint-disable-line
import { SectionHeading, Subheading as SubheadingBase } from "components/misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import EmailIllustrationSrc from "images/email-illustration.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-center max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)(props => [
  tw`md:w-5/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(SectionHeading)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`
const Textarea = styled(Input).attrs({as: "textarea"})`
  ${tw`h-24`}
`

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`
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
const card = {
  imageSrc:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
  title: "Veg Mixer",
  content: "Tomato Salad & Carrot",
  price: "$5.99",
  rating: "5.0",
  reviews: "87",
  url: "#"
}
export default ({
  subheading = "Contact Us",
  heading = <span tw="text-primary-500">Đặt hàng</span>,
  description = <>
    <span tw="text-primary-500 text-base text-red-500">XEM CẦN NHẮC NHỞ GÌ: KHUYỄN MÃI, THỜI GIAN ĐỊA ĐIỂM</span>
  </>,
  submitButtonText = "Send",
  formAction = "#",
  formMethod = "get",
  textOnLeft = true,
}) => {
  // The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
  const handleOnSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <Container>
      <TwoColumn>
        <TextColumn>
          <CardContainer key={1}>
            <Card className="group" initial="rest" whileHover="hover" animate="rest">
              <CardImageContainer imageSrc={card.imageSrc}>
                {/* <CardRatingContainer>
                  <CardRating>
                    <StarIcon />
                    {card.rating}
                  </CardRating>
                  <CardReview>({card.reviews})</CardReview>
                </CardRatingContainer> */}
                <CardHoverOverlay
                  variants={{
                    hover: {
                      opacity: 1,
                      height: "auto"
                    },
                    rest: {
                      opacity: 0,
                      height: 0
                    }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardButton>Buy Now</CardButton>
                </CardHoverOverlay>
              </CardImageContainer>
              <CardText>
                <CardTitle>{card.title}</CardTitle>
                {/* <CardContent>{card.content}</CardContent> */}
                <CardPrice>{card.price}</CardPrice>
              </CardText>
            </Card>
          </CardContainer>
        </TextColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {/* {subheading && <Subheading>{subheading}</Subheading>} */}
            <Heading>{heading}</Heading>
            {description && <Description>{description}</Description>}
            <Form action={formAction} method={formMethod}>
              <Input type="text" name="phone" required placeholder="Số điện thoại" />
              <Input type="email" name="email" placeholder="Email" />
              <Input type="text" name="name" placeholder="Họ và tên" />
              {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /> */}
              <Textarea name="message" placeholder="Bạn muốn lưu ý cho chúng tớ điều gì không" />
              <SubmitButton type="submit" onSubmit={()=>{handleOnSubmit()}}>{submitButtonText}</SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
