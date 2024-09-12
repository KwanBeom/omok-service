'use client';

import { useEffect, useState } from 'react';
import OmokGame from '@/components/OmokGame';
import socket from '../socket';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [data, setData] = useState('');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on('upgrade', (trans) => {
        setTransport(trans.name);
      });
    }

    if (socket.connected) {
      onConnect();
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('res', (resData) => {
      setData(resData);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    // <div>
    //   <p>Status: {isConnected ? 'connected' : 'disconnected'}</p>
    //   <p>Transport: {transport}</p>
    //   <button
    //     type="button"
    //     onClick={() => {
    //       socket.emit('abc', 'world');
    //     }}
    //   >
    //     emit
    //   </button>
    //   {data}
    // </div>
    <OmokGame />
  );
}
