import TwoColContactUsWithIllustrationFullForm from "components/forms/EditedTwoColContactUsWithIllustrationFullForm.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useLocation } from "react-router-dom";
export default function Checkout() {
  const location = useLocation();
  const {productId, productName, productType, numItems, currency, value, imageSrc} = location.state;
  console.log("productId, productName, productType, numItems, currency, value, imageSrc");
  console.log(productId, productName, productType, numItems, currency, value, imageSrc);
  return (
    <AnimationRevealPage>
        <Header></Header>
        <TwoColContactUsWithIllustrationFullForm
          state={{
            productId: productId,
            productName: productName,
            productType: productType,
            numItems: numItems,
            currency: currency,
            value: value,
            imageSrc: imageSrc
          }}
        ></TwoColContactUsWithIllustrationFullForm>
        <Footer></Footer>
    </AnimationRevealPage>
  )
}
