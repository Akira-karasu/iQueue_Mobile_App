import { io, Socket } from 'socket.io-client';

const BASE_URL = 'http://192.168.1.13:3000';
let transactionRecordSocket: Socket | undefined;
let requestTransactionProcessSocket: Socket | undefined;
let notificationSocket: Socket | undefined;

export function getTransactionRecordSocket(): Socket {
  if (!transactionRecordSocket) {
    transactionRecordSocket = io(`${BASE_URL}/transactionRecord`, { transports: ['websocket'] });
  }
  return transactionRecordSocket;
}

export function getRequestTransactionProcessSocket(): Socket {
  if (!requestTransactionProcessSocket) {
    requestTransactionProcessSocket = io(`${BASE_URL}/requestTransactionProcess`, { transports: ['websocket'] });
  }
  return requestTransactionProcessSocket;
}

export function getNotificationSocket(): Socket {
  if (!notificationSocket) {
    notificationSocket = io(`${BASE_URL}/notification`, { transports: ['websocket'] });
  }
  return notificationSocket;
}