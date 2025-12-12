// import { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io.connect(`http://localhost:3010`);

// const ChatRoom = ({ username, room }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   console.log(username, room);

//   useEffect(() => {
//     socket.emit("join_room", room);
//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });
//   }, [room]);

//   const sendMessage = () => {
//     console.log("send message");
//     if (message.trim()) {
//       const messageData = {
//         room,
//         author: username,
//         message,
//         time: new Date().toLocaleDateString(),
//         id: crypto.randomUUID(),
//       };
//       socket.emit("send_message", messageData);
//       setMessage((prev) => [...prev, messageData]);
//       sendMessage("");
//     }
//   };

//   return (
//     <div>
//       <h2>
//         Room: {room} ({username})
//       </h2>
//       <div>
//         {messages.map((msg) => (
//           <div>
//             <span>{msg.author}:</span> {msg.message}
//             <div>{msg.time} </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="text"
//           value={message}
//           placeholder="Type a message....."
//           onChange={(e) => setMessage(e.target.value)}
//           onkeydown={(e) => e.key === "Enter" && sendMessage()}
//         />

//         <button onClick={sendMessage}> send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatRoom;

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io.connect(`http://localhost:3010`);

const ChatRoom = ({ username, room }) => {
  const [message, setMessage] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEnd = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_typing", (user) => {
      setTypeMessage(`${user} is typing .........`);
      setTimeout(() => setTypeMessage(""), 2000);
    });
    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [room]);

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room,
        author: username,
        message,
        time: new Date().toLocaleTimeString(),
        id: crypto.randomUUID(),
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  const typingHandle = () => {
    socket.emit("typing", { username, room });
  };
  console.log(message);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-4xl fon-bold text-center mb-4 text-gray-800">
          my Chat Room: {room} ({username})
        </h2>

        <div className="h-72 overflow-y-scroll mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col mb-4 ${
                username === msg.author ? "text-right" : ""
              }`}
            >
              <div className="text-sm text-gray-500 ">
                {msg.author} - {msg.time}
              </div>
              <div className="bg-gray-200 p-3 rounded-lg shadow-sm text-gray-800">
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={messageEnd}></div>
        </div>
        <p className="italic text-2xl">{typeMessage}</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            placeholder="Type a message..."
            onChange={(e) => {
              setMessage(e.target.value);
              typingHandle();
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
