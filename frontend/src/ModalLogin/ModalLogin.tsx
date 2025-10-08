import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet, faEnvelope } from "@fortawesome/free-solid-svg-icons"

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLogin = ({ isOpen, onClose }: ModalLoginProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#0C0C0C] p-6 text-left align-middle shadow-xl transition-all border border-[#181C14]">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4 text-center"
                >
                  Connect with BadRabbit
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <button
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#181C14] hover:bg-[#181C14] transition-colors text-white cursor-pointer"
                    onClick={() => {
                      // Handle MetaMask login
                      console.log("MetaMask login")
                    }}
                  >
                    <img src="/metamask-icon.png" alt="" className='rounded-full w-8 h-8'/>
                    <span className="text-lg">Login with MetaMask</span>
                    <FontAwesomeIcon icon={faWallet} className="h-6 w-6" />
                  </button>

                  <button
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#181C14] hover:bg-[#181C14] transition-colors text-white cursor-pointer"
                    onClick={() => {
                      // Handle Email login
                      console.log("Email login")
                    }}
                  >
                    <img src="/gmail-logo.png" alt="" className='rounded-full w-8 h-8'/>
                    <span className="text-lg">Login with Email</span>
                    <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    By connecting, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalLogin