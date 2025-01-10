import  { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { signerAtom, signerConnectedAtom, userAtom } from "../atoms/atoms";
import { connectMetamask } from "../hooks/useProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config/config";
// import { JsonRpcSigner } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const [signer, setSigner] = useRecoilState(signerAtom);
  const  setUser = useSetRecoilState<any>(userAtom);
  const [signerConnected, setSignerConnected] = useRecoilState(signerConnectedAtom);
  const navigate = useNavigate();

  useEffect(() => {
    async function code() {
      if (signer) {
        const _user = await axios.post(`${backendUrl}createAccount`, {
          address: signer.address,
          name: signer.address,
        });
        setUser(_user.data);
      }
    }
    code();
  }, [signer, signerConnected]);

  const handleRestrictedAccess = (path: string) => {
    if (signerConnected) {
      navigate(path);
    } else {
      toast.error("Please connect your wallet to access this page!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center border-b border-zinc-500 p-4 bg-gray-800 shadow-lg text-white">
        <div className="font-extrabold text-5xl">Chess On Chain</div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              if (signerConnected) {
                navigate("/");
              }
            }}
            className="px-4 py-2 font-bold text-3xl rounded hover:text-green-700 transition"
          >
            Home
          </button>
          <button
            onClick={() => handleRestrictedAccess("/inventory")}
            className="px-4 py-2 font-bold text-3xl rounded hover:text-blue-700 transition"
          >
            Inventory
          </button>
          <button
            onClick={() => handleRestrictedAccess("/crates")}
            className="px-4 py-2 font-bold text-3xl rounded hover:text-pink-700 transition"
          >
            Crates
          </button>
          <button
            onClick={async function () {
              const res = await connectMetamask();
              if (res) setSigner(res);
              setSignerConnected(true);
              toast.success("Wallet connected successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
            }}
            className="px-4 py-2 font-bold text-3xl bg-white text-black rounded hover:bg-purple-700 transition"
          >
            {(signerConnected && <div>Connected</div>) || (
              <div>Connect MetaMask</div>
            )}
          </button>
        </div>
      </nav>
      <ToastContainer />
    </>
  );
}

export default Navbar;
