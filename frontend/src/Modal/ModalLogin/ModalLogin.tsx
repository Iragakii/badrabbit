import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from '../../../Auth/AuthContext';


interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLogin = ({ isOpen, onClose }: ModalLoginProps) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { login } = useAuth();

  async function connectMetaMask() {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }
    setIsConnecting(true);
    try {
      // 1. Connect MetaMask and get address
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0];
      setAddress(wallet);
      console.log("Connected wallet:", wallet);

      // 2. Request login message from backend
      const messageRes = await fetch(`/api/auth/message?address=${wallet}`);
      const { message } = await messageRes.json();

      // 3. Sign the message with MetaMask
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, wallet],
      });

      // 4. Send signature to backend for verification
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ address: wallet, signature }),
      });

      if (verifyRes.ok) {
        const response = await verifyRes.json();
        const { token } = response;
        console.log("Signature verified, JWT issued");
        login(token); // Update auth state with token
        // 5. Fetch wallet data after successful auth
        await fetchTokens(wallet);
        onClose(); // Close modal after successful connection
      } else {
        const error = await verifyRes.json();
        alert("Verification failed: " + error.error);
      }
    } catch (err) {
      console.error(err);
      alert("Connection failed: " + (err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }

  async function fetchTokens(address: string) {
    try {
      const res = await fetch(`/api/wallet/${address}/erc20`, {
        credentials: 'include',
      });
      const json = await res.json();
      console.log("ERC20 Tokens:", json);
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
    }
  }

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
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#181C14] hover:bg-[#181C14] transition-colors text-white cursor-pointer disabled:opacity-50"
                    onClick={connectMetaMask}
                  >
                    <img src="/metamask-icon.png" alt="" className='rounded-full w-8 h-8'/>
                    <span className="text-lg">{isConnecting ? "Connecting..." : "Login with MetaMask"}</span>
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