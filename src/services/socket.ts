import { io, Socket } from 'socket.io-client';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.iqueue.online';

let transactionRecordSocket: Socket | undefined;
let requestTransactionProcessSocket: Socket | undefined;
let notificationSocket: Socket | undefined;

export function getTransactionRecordSocket(email: string): Socket {
  if (!transactionRecordSocket) {
    transactionRecordSocket = io(`${BASE_URL}/transactionRecord`, {
      transports: ["websocket"],
      query: { email }, // <-- CRUCIAL
    });
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