import { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SocketIO = io(import.meta.env.VITE_WS_URL);

export type SocketContextType = {
  socketClient: Socket | null;
  socketStatus: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socketClient: null,
  socketStatus: false,
});

export const SocketProvider = ({ children }: any) => {
  const [socketStatus, setSocketStatus] = useState<boolean>(false);

  useEffect(() => {
    const onConnect = () => {
      setSocketStatus(true);
    };

    const onDisconnect = () => {
      setSocketStatus(false);
    };

    SocketIO.on("connect", onConnect);
    SocketIO.on("disconnect", onDisconnect);

    return () => {
      SocketIO.off("connect", onConnect);
      SocketIO.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketClient: SocketIO, socketStatus }}>
      {children}
    </SocketContext.Provider>
  );
};
