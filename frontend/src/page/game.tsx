import { useEffect, useState } from "react";
import Gameboard from "../components/gameboard";
import { Chess, Move } from "chess.js";
import { COLOR_BLACK } from "../components/types";
import { PacmanLoader } from "react-spinners";
import axios from "axios";
import { useRecoilState } from "recoil";
import { metadataAtom, metaMetadataAtom, userAtom } from "../atoms/atoms";
import { wsUrl } from "../config/config";
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


function Game() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
    const [metadata, setmetadata] = useRecoilState(metadataAtom)
    const [metaMetaData, setMetaMetaData] = useRecoilState(metaMetadataAtom)
  
  const [chess, setChess] = useState<Chess>(new Chess());
  const [board, setBoard] = useState<any>(chess.board());
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [color, setColor] = useState("");
  const [moves, setMoves] = useState<Move[]>([]);
    const [user, setUser] = useRecoilState<any>(userAtom);
  

  const [winner, setWinner] = useState(null);

  function mirrorBoard(brd: any[][]) {
    //const brd=chess.board()
    brd.map(function (i: any) {
      i = i.reverse();
    });
    return brd.reverse();
  }

  useEffect(function () {
    const _socket = new WebSocket(wsUrl);
    setSocket(_socket);
  }, []);
  useEffect(
    function () {
      if (!socket) {
        return;
      } else {
        console.log(chess.board());
        socket.onmessage = async function (data: any) {
          const message = JSON.parse(data.data);
          console.log(message);
          switch (message.type) {
            case INIT_GAME:
              setGameOver(false);
              setColor(message.payload.color);
              console.log(message.payload.metadata)
              setMetaMetaData(message.payload.metadata)
              if (message.payload.color == COLOR_BLACK) {
                const revBrd = mirrorBoard(chess.board());
                
                setBoard(revBrd);
              } else {
                setBoard(chess.board());
              }
              setStarted(true)
              setSearching(false)
              

              break;

            case MOVE:
              if (message.payload.move) {
                chess.move(message.payload.move);
                console.log(message.payload.move);
                setMoves([...moves, message.payload.move]);
                console.log("black")
                if (color == COLOR_BLACK) {
                  console.log("black")
                  const revBrd = mirrorBoard(chess.board());
                  setBoard(revBrd);
                } else {
                  setBoard(chess.board());
                }
              }
              break;
            case GAME_OVER:
              setGameOver(true);
              setWinner(message.payload.winner);
              

              break;
          }
        };
      }
    },
    [ chess,board]
  );

  return (
    <div className="bg-zinc-900 h-screen text-white flex justify-center">
      <div className="  m-10 text-4xl font-bold flex justify-center flex-col ">
        {/* {gameOver && (
          <div className=" text-4xl font-bold flex justify-center flex-col items-center">
            <div>Game Over</div>
            <div> {color == winner ? "You Won" : "You Lost"} </div>
          </div>
        )} */}
      {started&& <div className="text-2xl m-1 font-semibold">Opponent Side</div>}
        <Gameboard board={board} socket={socket} color={color} ></Gameboard>
      {started&& <div className="text-2xl m-1 font-semibold">Your Side</div>}
      
        
      </div>
      <div className="flex p-4 rounded-xl flex-col items-center   m-10 bg-zinc-800 w-1/4">
        <button
          onClick={function () {
            const _chess = new Chess();
            setChess(_chess);
            setBoard(_chess.board());
            setMoves([]);
            setWinner(null);
            setStarted(false)
            setSearching(true)
            if(user){

              socket?.send(
                JSON.stringify({
                  type: INIT_GAME,
                  payload:{
                    id:user.id,
                    name:user.name,
                    address:user.address,
                    metadata:metadata
                  }
                })
              );
            }else{
              console.log("nono")
            }
          }}
          className="bg-white text-black text-2xl rounded-md p-2 m-2 font-bold"
        >
          Start New Game
        </button>
        {started&& <div className="bg-zinc-950 w-full items-center flex flex-col p-2 m-2 rounded-lg">
          <div className="text-xl font-bold ">Moves</div>
          <div className="overflow-auto h-52 w-full flex flex-col items-center  ">
            {moves.map(function (i: any) {
              return (
                <div>
                  {i.from} - {i.to}
                </div>
              );
            })}{" "}
          </div>
        </div>}
        {searching&& <div className="select-none m-2 p-2 flex flex-col items-center">
          <PacmanLoader color="#ffffff" size={20} />
          <h5>Searching For Opponents....</h5>

        </div> }
        <div>
          {gameOver && (
            <div className=" text-4xl font-bold flex justify-center flex-col items-center">
              <div>Game Over</div>
              <div> {color == winner ? "You Won" : "You Lost"} </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
