import { io, Socket } from 'socket.io-client';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.iqueue.online';

const socketCache = new Map<number, Socket>();

let transactionRecordSocket: Socket | undefined;
let requestTransactionProcessSocket: Socket | undefined;
let notificationSocket: Socket | undefined;

export function getTransactionRecordSocket(email: string): Socket {
  if (!transactionRecordSocket) {
    transactionRecordSocket = io(`${BASE_URL}/transactionRecord`, {
      transports: ["websocket"],
      query: { email },
    });
  }
  return transactionRecordSocket;
}

// ✅ FIXED: Use BASE_URL instead of localhost
export function getRequestTransactionProcessSocket(personalId: number): Socket {
  // ✅ If socket already exists for this personalId, return it
  if (socketCache.has(personalId)) {
    const existingSocket = socketCache.get(personalId)!;
    console.log("♻️ Reusing existing socket for personalId:", personalId, "ID:", existingSocket.id);
    if (existingSocket.connected) {
      return existingSocket;
    }
  }

  // ✅ Create new socket only if it doesn't exist
  console.log("🆕 Creating new socket for personalId:", personalId);
  console.log("📡 Connecting to:", `${BASE_URL}/requestTransactionProcess`);
  
  const socket = io(`${BASE_URL}/requestTransactionProcess`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"], // ✅ Add polling as fallback
  });

  // ✅ Debug logging
  socket.on("connect", () => {
    console.log("✅ RequestTransactionProcess socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ RequestTransactionProcess connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ RequestTransactionProcess disconnected:", reason);
  });

  // ✅ Cache it
  socketCache.set(personalId, socket);

  return socket;
}

// ✅ IMPORTANT: Clear socket from cache when disconnecting
export function disconnectRequestTransactionProcessSocket(personalId: number): void {
  const socket = socketCache.get(personalId);
  if (socket) {
    console.log("❌ Disconnecting and removing socket for personalId:", personalId);
    socket.disconnect();
    socketCache.delete(personalId);
  }
}

// ✅ Clear all sockets
export function disconnectAllSockets(): void {
  console.log("❌ Disconnecting all sockets");
  socketCache.forEach((socket) => {
    socket.disconnect();
  });
  socketCache.clear();
}

export function getNotificationSocket(): Socket {
  if (!notificationSocket) {
    notificationSocket = io(`${BASE_URL}/notification`, { transports: ['websocket'] });
  }
  return notificationSocket;
}