import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect(`http://localhost:3010`);

const ChatRoom = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(username, room);

  useEffect(() => {
    socket.emit("join_room", room);
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [room]);

  const sendMessage = () => {
    console.log("send message");
    if (message.trim()) {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleDateString(),
        id: crypto.randomUUID(),
      };
    }
  };

  return (
    <div>
      <h2>
        Room: {room} ({username})
      </h2>
      <div>
        {messages.map((msg) => (
          <div>
            <span>{msg.author}:</span> {msg.message}
            <div>{msg.time} </div>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          placeholder="Type a message....."
          onChange={(e) => setMessage(e.target.value)}
          onkeydown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}> send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
