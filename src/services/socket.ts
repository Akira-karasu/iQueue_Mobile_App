import { io, Socket } from 'socket.io-client';

const BASE_URL = 'http://192.168.1.13:3000';

export const transactionRecordSocket: Socket = io(`${BASE_URL}/transactionRecord`, {
  transports: ['websocket'], 
});

export const requestTransactionProcessSocket: Socket = io(`${BASE_URL}/requestTransactionProcess`, {
transports: ['websocket'],
});

export const notificationSocket: Socket = io(`${BASE_URL}/notification`, {
transports: ['websocket'],
});


