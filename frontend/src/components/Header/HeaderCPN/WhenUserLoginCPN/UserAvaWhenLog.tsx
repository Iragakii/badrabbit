
import Link from "@mui/material/Link";

const UserAvaWhenLog = () => {
  return (
    <>
      <Link href="/profile" underline="none">
        <button className=" cursor-pointer">
          <img
      src="/defaultava.png"
      alt="Token Avatar"
      className="w-7 h-7 rounded-full object-cover "
    />
        </button>
      </Link>
    </>
  );
};

export default UserAvaWhenLog;
