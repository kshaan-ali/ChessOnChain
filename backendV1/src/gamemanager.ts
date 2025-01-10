import { WebSocket } from "ws";
require('dotenv').config();
import {
  COLOR_BLACK,
  COLOR_WHITE,
  GAME_OVER,
  INIT_GAME,
  MOVE,
} from "./messages";
import { Chess, Move } from "chess.js";
const backendUrl = process.env.backendUrl ||"http://localhost:3000";

import axios from "axios";

interface move {
  from: string;
  to: string;
}
interface player {
  sc: WebSocket;
  name?: string;
  address?: string;
  id?: string;
  color?: string;
  metaData:any[];
}
interface user {
  sc: WebSocket|null;
  name?: string;
  address?: string;
  id?: string;
  color?: string;
  metaData:any[]
}
class Game {
  public p1: player;
  public p2: player;
  private chess: Chess;
  private startTime: Date;
  public moveCount: number;
  public metaMetadata:any[]

  constructor(player1: WebSocket, player2: WebSocket,p1Metadata:object[],p2Metadata:object[]) {
    this.p1 = { sc: player1, color: COLOR_WHITE,metaData:p1Metadata };
    this.p2 = { sc: player2, color: COLOR_BLACK,metaData:p2Metadata };
    this.moveCount = 0;
    this.chess = new Chess();
    this.startTime = new Date();

    this.p1.metaData.map((i)=>{
      i.color=COLOR_WHITE
    })
    this.p2.metaData.map((i)=>{
      i.color=COLOR_BLACK
    })
    this.metaMetadata=this.p1.metaData.concat(this.p2.metaData)
    // console.log(this.p1.metaData)
    // console.log(this.p2.metaData)
    // console.log(this.metaMetadata)
    this.p1.sc.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color:COLOR_WHITE,
          metadata:this.metaMetadata
        },
      })
    );
    this.p2.sc.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color:COLOR_BLACK,
          metadata:this.metaMetadata
        },
      })
    );
  }

  makeMove(sc: WebSocket|null, move: move) {
    if (this.p1.sc && this.p2.sc) {
      if (this.moveCount % 2 == 0 && sc !== this.p1.sc) {
        console.log("white expected to move");
        return;
      }
      if (this.moveCount % 2 !== 0 && sc !== this.p2.sc) {
        console.log("black expected to move");
        return;
      }
      try {
        this.chess.move(move);
        this.moveCount++;
      } catch (e) {
        console.log(e);
        return;
      }
      if (this.chess.isGameOver()) {
        const winner = this.moveCount % 2 == 0 ? COLOR_BLACK : COLOR_WHITE;
        this.p1.sc.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner: winner,
            },
          })
        );
        this.p2.sc.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: {
              winner: winner,
            },
          })
        );
      }
      this.p2.sc.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
          },
        })
      );
      this.p1.sc.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: move,
          },
        })
      );
    }
  }
}

/////////////////////////////////////////

export class GameManager {
  private games: Game[];
  private pendinguser!: user;
  private userOnline: WebSocket[];
  constructor() {
    this.games = [];
    this.userOnline = [];
    this.pendinguser ={sc:null,metaData:[]};
  }

  addUser(sc: WebSocket) {
    this.userOnline.push(sc);
    this.handleEvent(sc);
  }
  removeUser(sc: WebSocket) {
    this.userOnline = this.userOnline.filter(function (u) {
      u !== sc;
    });
  }

  async handleEvent(sc: WebSocket) {
    sc.on("message",async (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        const game = this.games.find((g) => g.p1.sc === sc || g.p2.sc === sc);
        if (game) {
          this.games = this.games.filter((g) => g !== game);
        }
        if (this.pendinguser.sc && this.pendinguser.sc !== sc) {

          //start game

          this.games.push(new Game(this.pendinguser.sc, sc,this.pendinguser.metaData,message.payload.metadata));
          console.log("match started");
          try {
            const gameDb = await axios.post(`${backendUrl}/createGame`, {
              whiteId: this.pendinguser.id,
              blackId: message.payload.id
            });
            console.log(gameDb.data)
          } catch (e) {
            console.log(e);
          }
          this.pendinguser.sc = null;
        } else {
          this.pendinguser.sc = sc;
          this.pendinguser.id=message.payload.id
          this.pendinguser.metaData=message.payload.metadata
        }
      }
      if (message.type === MOVE) {
        const game = this.games.find((g) => g.p1.sc === sc || g.p2.sc === sc);
        if (game) {
          game.makeMove(sc, message.move);
        }
      }
    });
  }
}
