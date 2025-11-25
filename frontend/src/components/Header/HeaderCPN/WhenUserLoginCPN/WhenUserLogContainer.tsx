import UserAvaWhenLog from './UserAvaWhenLog'
import MetaMaskAddress from '../../../MetaMaskAddress/MetaMaskAddress'
import ArrowSlide from './ArrowSlide'
import SlideLoginFormContainer from './SlideLoginForm/SlideLoginFormContainer'
import MetaMaskAvatar from '../../../MetaMaskAvatar/MetaMaskAvatar'
import Notification from './Notification'
import TotalETHvWETHinWalletCPN from './TotalETHvWETHinWalletCPN'
import Link from '@mui/material/Link'
import { useAuth } from '../../../../../Auth/AuthContext'

const WhenUserLogContainer = () => {
  const { address } = useAuth();

  return (
    <>
      <div className="relative flex items-center gap-7 mt-1">
        <div className='border-l-1 border-r-1 border-[#181C14] px-3 py-[8px] rounded-l-none rounded-r-none hover:bg-[#ffffff]/8 rounded-md cursor-pointer'>
          <TotalETHvWETHinWalletCPN></TotalETHvWETHinWalletCPN>
        </div>
        
        <div className=''>
          <Notification></Notification>
        </div>

        <div className="relative group">
          <Link underline="none" href={`/${address || 'profile'}`}>
            <div className="no-underline border-l-1 rounded-l-none border-[#181C14] flex py-[2px] pt-[4px] rounded-md px-3 cursor-pointer hover:bg-[#ffffff]/8">
              <div className='w-7 h-7'>
                <UserAvaWhenLog></UserAvaWhenLog>
              </div>

              <div className="relative top-[18px] left-[-10px]">
                <MetaMaskAvatar></MetaMaskAvatar>
              </div>

              <MetaMaskAddress></MetaMaskAddress>
              
              <div className='flex items-center ml-3'>
                <ArrowSlide></ArrowSlide>
              </div>
            </div>
          </Link>

          {/* Dropdown - moved outside Link and positioned relative to parent div */}
          <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
            <SlideLoginFormContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default WhenUserLogContainer