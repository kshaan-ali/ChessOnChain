import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { signerAtom, userAtom } from "../atoms/atoms";
import { contractFetcher } from "../blockchain/lib";
import { Contract, ethers } from "ethers";
import { openCrate, openCrateBishop, openCrateKing, openCrateKnight, openCratePawn, openCrateQueen, openCrateRook, prices, randomCratePrice } from "../blockchain/function";

enum typePiece {
  Random = "Random",
  King = "King",
  Queen = "Queen",
  Bishop = "Bishop",
  Rook = "Rook",
  Pawn = "Pawn",
  Knight = "Knight",
}

function Crates() {
  const [reciept, setreciept] = useState<any>(false);
  const [crates, setCrates] = useState<any[] | false>(false);
  const [rookPrice, setRookPrice] = useState<BigInt|number>(0);
  const [pawnPrice, setpawnPrice] = useState<BigInt|number>(0);
  const [KingPrice, setKingPrice] = useState<BigInt|number>(0);
  const [QueenPrice, setQueenPrice] = useState<BigInt|number>(0);
  const [KnightPrice, setKnightPrice] = useState<BigInt|number>(0);
  const [BishopPrice, setBishopPrice] = useState<BigInt|number>(0);
  const [Random, setRandom] = useState<BigInt|number>(0);
  const [contr, setContr] = useState<false | Contract>(false);
  const [signer, setSigner] = useRecoilState(signerAtom);

  const navigate = useNavigate();
  useEffect(() => {
    async function code() {
      if (signer) {
        const contract = await contractFetcher(signer);
        setContr(contract);
        const [bishop, king, knight, queen, rook, pawn, random] = await Promise.all([
          prices(contract, "Bishop"),
          prices(contract, "King"),
          prices(contract, "Knight"),
          prices(contract, "Queen"),
          prices(contract, "Rook"),
          prices(contract, "Pawn"),
          randomCratePrice(contract),
        ]);

        // Update state with fetched prices
        setBishopPrice(bishop);
        setKingPrice(king);
        setKnightPrice(knight);
        setQueenPrice(queen);
        setRookPrice(rook);
        setpawnPrice(pawn);
        setRandom(random);
        console.log(
          bishop,king,queen,knight,rook,pawn
        );
        const _crates = [
          {
            id: 1,
            type: typePiece.Random,
            name: "Random Pieces Crate",
            price: random,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
            ],
          },
          {
            id: 2,
            type: typePiece.King,
            name: "King Crate",
            price: king,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
            ],
          },
          {
            id: 3,
            type: typePiece.Queen,

            name: "Queen Crate",
            price: queen,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
            ],
          },
          {
            id: 4,
            type: typePiece.Pawn,

            name: "Pawn Crate",
            price: pawn,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
            ],
          },
          {
            id: 5,
            type: typePiece.Rook,

            name: "Rook Crate",
            price: rook,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
            ],
          },
          {
            id: 6,
            type: typePiece.Bishop,
            name: "Bishop Crate",
            price: bishop,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
            ],
          },
          {
            id: 5,
            type: typePiece.Knight,
            name: "Knight Crate",
            price: knight,
            images: [
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmbrFsV3qgjiyqCS9fK3wAi3aySJHCVUqZh76FAQvHEi6f",
              "https://inherent-scarlet-tarsier.myfilebase.com/ipfs/QmSotceC1VNKKjYcAPz4dXSiHGWbKtu3kRCZNroUKD5wEC",
            ],
          },
        ];
        console.log(_crates)
        setCrates(_crates);
      } else {
        navigate("/");
      }
    } 
    code();
  }, [signer]);



  

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold text-center mb-10">
          Crate Opening Game
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contr && crates &&
            crates.map((crate: any) => (
              <div
                key={crate.id}
                className={`bg-gray-800 ${
                  crate.id === 1 ? "col-span-3" : ""
                } p-4 rounded-lg shadow-md text-center`}
              >
                <h2 className="text-xl font-semibold">{crate.name}</h2>
                <p className="text-gray-400 mt-2">
                  Price:{" "}
                  {crate.price && crate.price > 0
                    ? `${ethers.formatUnits(crate.price,18)} Pol` : "Loading..."}{" "}
                </p>
                <center>
                  <div className="mt-4 w-96 h-24 relative overflow-hidden bg-gray-600 rounded-lg">
                    <div className="absolute flex animate-scroll">
                      {/* Add the images twice in the animation container */}
                      {crate.images.map((img: any, index: any) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Crate ${crate.name} Item ${index}`}
                          className="w-24 h-24 object-cover ml-1 rounded-sm"
                        />
                      ))}
                      {crate.images.map((img: any, index: any) => (
                        <img
                          key={index + crate.images.length} // Make sure each element has a unique key
                          src={img}
                          alt={`Crate ${crate.name} Item ${index}`}
                          className="w-24 h-24 object-cover ml-1 rounded-sm"
                        />
                      ))}
                    </div>
                  </div>
                </center>

                <button
                  onClick={async () => {
                    let recpt;
                    switch (crate.type) {
                      case typePiece.Random:
                        recpt=await openCrate(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.Bishop:
                        recpt=await openCrateBishop(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.King:
                        recpt=await openCrateKing(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.Knight:
                        recpt=await openCrateKnight(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.Pawn:
                        recpt=await openCratePawn(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.Queen:
                        recpt=await openCrateQueen(contr,crate.price)
                        setreciept(recpt)
                        break;
                      case typePiece.Rook:
                        recpt=await openCrateRook(contr,crate.price)
                        setreciept(recpt)
                        break;
                    
                      
                    }
                  }}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Open Crate
                </button>
              </div>
            ))}
        </div>
        {reciept && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="text-white flex flex-col items-center bg-gray-900 p-6 rounded-lg shadow-lg w-3/4 ">
              <h2 className="text-4xl font-bold mb-4 ">Crate Opened!</h2>
              <p className="text-lg mb-4">Congratulations! You received a Nft</p>
              <p className="text-xl font-semibold mb-4">BlockHash: {reciept.blockHash}</p>
              <p className="text-xl font-semibold mb-4">Hash: {reciept.hash}</p>
              <p className="text-lg flicker mb-4 text-red-500 font-bold">Check The Inventory Tab For your new Item</p>
             
              <button
                onClick={() => setreciept(false)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Tailwind Animation */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            .animate-scroll {
              display: flex;
              animation: scroll 10s linear infinite;
            }
              @keyframes flicker {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
    
  }

  .flicker {
    animation: flicker 1s infinite;
          `}
        </style>
      </div>
    </div>
  );
}

export default Crates;
