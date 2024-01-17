import axios from 'axios';
import { useRef, useState } from 'react';

interface Message {
  event: 'connection' | 'message';
  username: string;
  date: number;
  id: number;
  message: string;
}

const WebSockets = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket>();
  const [username, setUsername] = useState('');

  const sendMessage = async () => {
    const message: Message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
      date: Date.now(),
    };

    socket.current!.send(JSON.stringify(message));
    setValue('');
  };

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      console.log('CONNECTED');
      const message: Message = {
        event: 'connection',
        username,
        id: Date.now(),
        date: Date.now(),
        message: 'connected',
      };
      socket.current?.send(JSON.stringify(message));
      setConnected(true);
    };
    socket.current.onmessage = (e: MessageEvent<string>) => {
      const message = JSON.parse(e.data) as Message;
      setMessages((prev) => [message, ...prev]);
    };

    socket.current.onclose = () => {
      console.log('Socket closed');
    };
    socket.current.onerror = () => {
      console.log('SOCKET ERROR');
    };
  };

  if (!connected) {
    return (
      <div>
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Your name"
          />
          <button onClick={connect}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="button" onClick={sendMessage}>
        Send
      </button>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.event === 'connection' ? (
              <div>user {username.toUpperCase()} just connected</div>
            ) : (
              <div>
                {msg.username}: {msg.message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSockets;
