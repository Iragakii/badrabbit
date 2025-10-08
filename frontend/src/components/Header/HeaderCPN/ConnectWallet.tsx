import { useState } from 'react'
import ModalLogin from '../../../ModalLogin/ModalLogin'

const ConnectWallet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded-lg      hover:bg-[#2C5A34] transition-colors text-white cursor-pointer"
      >
        Connect Wallet
      </button>

      <ModalLogin 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ConnectWallet