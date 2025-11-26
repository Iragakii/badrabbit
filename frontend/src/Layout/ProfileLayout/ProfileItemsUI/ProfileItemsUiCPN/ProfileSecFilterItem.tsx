

const ProfileSecFilterItem = () => {
    const countTemp  = 7;
  return (
    <>
      <div className="flex justify-between py-1  container mx-auto ">
        <div className="flex gap-2">
            <span className="text-gray-400 ">{countTemp}</span>
          <button className=" text-gray-400 uppercase">Items</button>
        </div>
      
      </div>
    </>
  );
};

export default ProfileSecFilterItem;
