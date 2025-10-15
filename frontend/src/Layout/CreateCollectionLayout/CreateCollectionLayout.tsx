import FooterCreateColle from "./CreateCollectionLayoutCPN/FooterCreateColle"
import HeaderCreateColle from "./CreateCollectionLayoutCPN/HeaderCreateColle"
import MainCreateCollec from "./CreateCollectionLayoutCPN/MainCreateCollec"


const CreateCollectionLayout = () => {
  return (
    <>
      <div className="bg-[#0C0C0C] h-screen  ">
          <HeaderCreateColle></HeaderCreateColle>
          <MainCreateCollec></MainCreateCollec>
          <FooterCreateColle></FooterCreateColle>
      </div>
    </>
  )
}

export default CreateCollectionLayout