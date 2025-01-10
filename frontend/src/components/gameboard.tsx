import {  Color,  PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
import { Img } from "react-image";
import { COLOR_WHITE } from "./types";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  equippedItemsAtom,
  metadataAtom,
  metaMetadataAtom,
  signerAtom,
} from "../atoms/atoms";
import { tokenURI } from "../blockchain/function";
import { contractFetcher } from "../blockchain/lib";
import axios from "axios";

function Gameboard({
  socket,
  board,
  color,
}: {
  socket: WebSocket | null;
  board: {
    square: Square;
    type: PieceSymbol;
    color: Color;
  }[][];
  color: string;
}) {
  // const boardRepresentation:{square:string}[][]=[]
  const [from, setFrom] = useState<Square | null>(null);
  const  setmetadata = useSetRecoilState(metadataAtom);
  // const [to, setTo] = useState<Square | null>(null);
  const equippedItems = useRecoilValue(equippedItemsAtom);
  const metaMetaData = useRecoilValue(metaMetadataAtom);

  const signer = useRecoilValue(signerAtom);
  useEffect(() => {
    async function code() {
      if (signer) {
        const contract = await contractFetcher(signer);
        const metadataArray: any = [];
        await Promise.all(
          equippedItems.map(async (i) => {
            const uri = await tokenURI(contract, i);
            const metadata = await axios.get(uri);
            if (metadata.data !== undefined) {
              metadata.data.color = "";
              metadataArray.push(metadata.data);
            }
          })
        );
        console.log(metadataArray[0]); //here gpt
        setmetadata(metadataArray);
      } else {
      }
    }
    code();
  }, [signer]);

  return (
    <div className="flex flex-col items-center  border-zinc-950 border-8 rounded-lg">
      <div>
        <div></div>
      </div>
      {board &&
        board.map(function (outer, i) {
          return (
            <div className="flex">
              {outer.map(function (inner, j) {
                const boardRepresentation =
                  color == COLOR_WHITE
                    ? ((String.fromCharCode(97 + j) +
                        "" +
                        (8 - i).toString()) as Square)
                    : ((String.fromCharCode(104 - j) +
                        "" +
                        (1 + i).toString()) as Square);

                return (
                  <div
                    onClick={function () {
                      if (from) {
                        // setTo(boardRepresentation);
                        socket?.send(
                          JSON.stringify({
                            type: MOVE,
                            move: {
                              from: from,
                              to: boardRepresentation,
                            },
                          })
                        );
                        // chess.move({from:from,to:boardRepresentation})
                        setFrom(null);
                      } else {
                        setFrom(boardRepresentation);
                      }

                      console.log(boardRepresentation);
                    }}
                    className={` h-16 w-16 flex justify-center items-center ${
                      (j + i) % 2 == 0
                        ? "bg-blue-400 hover:bg-slate-400  focus:bg-red-500"
                        : "bg-blue-700 hover:bg-slate-400 focus:bg-red-500"
                    }`}
                  >
                    {inner
                      ? ( (metaMetaData.length > 0 &&
                        (metaMetaData?.find(
                          (i) => i.attributes[0].value == inner.type
                        ) &&
                        metaMetaData?.find((i) => i.color == inner.color))) ? (
                          <Img
                            src={`${
                              (metaMetaData?.find(
                                (i) => i.attributes[0].value == inner.type
                              )).image
                            }`}
                          ></Img>
                        ) : (
                          <div>
                            
                            <Img
                              src={`./public/${inner.type}${inner.color}.png`}
                            ></Img>{" "}
                          </div>
                        ))
                      : ""}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}

export default Gameboard;
