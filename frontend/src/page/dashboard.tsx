import  {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectMetamask } from "../hooks/useProvider";
import { useRecoilState, useSetRecoilState } from "recoil";
import { signerAtom, signerConnectedAtom, userAtom } from "../atoms/atoms";
import Navbar from "../components/navbar";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [signerConnected] = useRecoilState(signerConnectedAtom);
  const [user] = useRecoilState<any>(userAtom);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="src/assets/dashboardImage/v4.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 -z-10"></div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-bold mb-8 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Welcome To The Best Free Multiplayer Web3 Chess Game
        </h1>
        <button
          onClick={() => {
            if (user) {
              navigate("/game");
            } else {
              setIsModalOpen(true);
            }
          }}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transition transform hover:scale-110 shadow-lg"
        >
          Play
        </button>
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

const Modal = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const  setSigner = useSetRecoilState(signerAtom);
  const setSignerConnected = useSetRecoilState(signerConnectedAtom);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-80 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Choose Your Option</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={async () => {
              const connectedSigner = await connectMetamask();
              if (connectedSigner) {
                setSigner(connectedSigner);
                setSignerConnected(true);
                onClose();
              }
            }}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-lg font-semibold hover:from-teal-500 hover:to-green-500 transition shadow-md"
          >
            Connect MetaMask (Play for Free)
          </button>
          <button
            onClick={() => navigate("/game")}
            className="px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-pink-500 transition shadow-md"
          >
            Guest Play
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
