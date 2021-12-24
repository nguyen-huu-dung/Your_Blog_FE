import React from 'react';
import { io } from 'socket.io-client';

export const connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};
export const socket = io(`${process.env.REACT_APP_URL_BE}/notify`, connectionOptions);
export const SocketContext = React.createContext();

