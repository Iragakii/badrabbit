import { Link } from "react-router-dom"


const ButtonSettingProfileUI = () => {
  return (
    <> 
       <div>
               <Link to="/settings/profile"><button className='cursor-pointer hover:scale-120 transition'><img src="/brush.svg" alt="" className='w-5 h-5'/></button></Link> 
       </div>
    </>
  )
}

export default ButtonSettingProfileUI