import Stack from "./StackImg";

const images = [
  {
    id: 1,
    img: "/createdui/pinkpanther.jpg",
  },
];
const images2 = [
  {
    id: 2,
    img: "/createdui/hmm.jpg",
  },
];
const images3 = [
  {
    id: 3,
    img: "/createdui/meow.jpg",
  },
];
const DefaultImgCreatedUI = () => {
  return (
    <>
      <div className="flex">
        <div className="relative top-5 left-20 z-10 rotate-[-20deg]">
          <Stack
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={false}
            cardDimensions={{ width: 170, height: 170 }}
            cardsData={images}
          ></Stack>
        </div>
        <div className="relative z-20">
          {" "}
          <Stack
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={false}
            cardDimensions={{ width: 190, height: 190 }}
            cardsData={images2}
          ></Stack>
        </div>
        <div className="relative top-5 right-20 z-10  rotate-[20deg]">
          <Stack
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={false}
            cardDimensions={{ width: 170, height: 170 }}
            cardsData={images3}
          ></Stack>
        </div>
      </div>
    </>
  );
};

export default DefaultImgCreatedUI;
