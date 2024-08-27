import TwoColContactUsWithIllustrationFullForm from "components/forms/EditedTwoColContactUsWithIllustrationFullForm.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/MiniCenteredFooter";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { useLocation } from "react-router-dom";
import GetStartedLight from "components/cta/GetStartedLight";
export default function Checkout() {
  const location = useLocation();
  const {designId} = location.state || {};
  console.log("designId", designId);
  return (
    <AnimationRevealPage>
        <Header></Header>
        {
          (designId)?
          <TwoColContactUsWithIllustrationFullForm
            state={{
              designId: designId
            }}
          ></TwoColContactUsWithIllustrationFullForm>
          :<GetStartedLight
            heading="Bạn chưa có thiết kế nào để đặt hàng"
            primaryLinkText="Tạo thiết kế ngay"
            primaryLinkUrl="/design-app"
            secondaryLinkText="Tìm hiểu thêm"
            secondaryLinkUrl="/"
          ></GetStartedLight>
        }
        <Footer></Footer>
    </AnimationRevealPage>
  )
}
