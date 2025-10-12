import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "@mui/material/Link";

const UserIconNotLog = () => {
  return (
    <>
      <Link href="/profile" underline="none">
        <button className=" p-2 w-10 h-10 flex justify-center items-center cursor-pointer  ">
          <FontAwesomeIcon icon={faCircleUser} className="fa-xl text-[#ffffff]" />
        </button>
      </Link>
    </>
  );
};

export default UserIconNotLog;
