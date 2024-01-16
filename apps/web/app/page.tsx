'use client';
import { useState } from 'react';
import { useSocket } from '../context/socketProvider';
import classes from './page.module.css';

export default function Page() {
  const { sendMessage, messages } = useSocket();

  const [message, setMessage] = useState('');
  return (
    <div className={classes['container']}>
      <div>
        <input
          className={classes['chat-input']}
          onChange={(e) => setMessage(e.target.value)}
          type='text'
          placeholder='Message..'
        />
      </div>
      <button
        onClick={() => sendMessage(message)}
        className={classes['button']}
      >
        Send
      </button>
      <div>
        {messages.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </div>
    </div>
  );
}
