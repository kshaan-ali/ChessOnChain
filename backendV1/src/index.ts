import { WebSocketServer } from 'ws';
import { GameManager } from './gamemanager';

const wss = new WebSocketServer({ port: 8080 });
console.log("server started successfuly")
const gameManager=new GameManager()
wss.on('connection', function connection(ws) {
    
 gameManager.addUser(ws)
 wss.on('close',()=>gameManager.removeUser(ws))
 
 console.log("conection established successfuly by")
});
