import  { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useRecoilState, useRecoilValue } from "recoil";
import { equippedItemsAtom, signerAtom } from "../atoms/atoms";
import { useNavigate } from "react-router-dom";
import { contractFetcher } from "../blockchain/lib";
import { ownerOfMintedTokens, tokenURI } from "../blockchain/function";
import axios from "axios";
import { PacmanLoader } from "react-spinners";

function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [equippedItems, setEquippedItems] = useRecoilState(equippedItemsAtom);
  const signer  = useRecoilValue(signerAtom);
  
  const navigate = useNavigate();

  useEffect(() => {
    async function code() {
      if (signer) {
        const contract = await contractFetcher(signer);
        const tokenArray = await ownerOfMintedTokens(contract, signer.address);
        try {
          const fetchedItems = await Promise.all(
            tokenArray.map(async (tokenId) => {
              try {
                const uri = await tokenURI(contract, tokenId);
                const metadata = await axios.get(uri);
                if(metadata){

                  return { id: tokenId, ...metadata.data };
                }
              } catch (error) {
                console.error(`Error fetching metadata for tokenId ${tokenId}:`, error);
                 
              } 
            })
          );
          setItems(fetchedItems.filter((item) => item !== undefined));
          console.log(items)
        } catch (error) {
          console.error("Error fetching metadata:", error);
        } // Add new item
      } else {
        navigate("/");
      }
    }
    code();
  }, [signer]);

  const toggleItem = (item: any) => {
    if (equippedItems.includes(item.id)) {
      // Unequip item
      setEquippedItems(equippedItems.filter((id) => id !== item.id));
    } else {
      // Equip item
      setEquippedItems([...equippedItems, item.id]);
    }
  };
  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Inventory Grid */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Inventory</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {items &&items.length > 0 ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-800 p-4 rounded-lg cursor-pointer relative transition-transform ${
                    equippedItems.includes(item.id)
                      ? "ring-4 ring-green-500"
                      : "hover:scale-105"
                  }`}
                  onClick={() => {toggleItem(item)
                    console.log(equippedItems)
                  }}
                >
                 
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <h2 className="mt-2 text-lg font-semibold text-center">
                    {item.name} 
                  </h2>
                  {equippedItems.includes(item.id) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div> <PacmanLoader color="white"></PacmanLoader> </div>
            )}
          </div>
        </div>

        {/* Sidebar for Equipped Items */}
        <div className="w-64 bg-gray-800 p-4 border-l border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-center">Equipped Items</h2>
          {equippedItems.length > 0 ? (
            <ul className="space-y-2">
              {equippedItems.map((id) => {
                const item = items.find((i) => i.id === id);
                return (
                  item && (
                    <li
                      key={id}
                      className="flex items-center gap-2 p-2 bg-gray-700 rounded-md"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-md"
                      />
                      <span className="text-gray-300">{item.name}</span>
                    </li>
                  )
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No items equipped.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;
