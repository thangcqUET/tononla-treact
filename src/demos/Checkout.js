import TwoColContactUsWithIllustrationFullForm from "components/forms/EditedTwoColContactUsWithIllustrationFullForm.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
export default function Example() {
  return (
    <AnimationRevealPage>
        <Header></Header>
        <TwoColContactUsWithIllustrationFullForm></TwoColContactUsWithIllustrationFullForm>
        <Footer></Footer>
    </AnimationRevealPage>
  )
}
