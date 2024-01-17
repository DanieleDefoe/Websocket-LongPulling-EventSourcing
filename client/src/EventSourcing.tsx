import axios from 'axios';
import { useEffect, useState } from 'react';

interface Message {
  message: string;
  id: number;
}

const Longpulling = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:5000/connect');

    eventSource.onmessage = (event: MessageEvent<string>) => {
      setMessages((prev) => [JSON.parse(event.data), ...prev])
    };
  };

  const sendMessage = async () => {
    await axios.post('http://localhost:5000/new-message', {
      message: value,
      id: Date.now(),
    });
  };

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
          <div key={msg.id}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Longpulling;
