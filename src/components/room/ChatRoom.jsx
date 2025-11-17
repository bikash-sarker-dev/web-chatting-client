import io from "socket.io-client";

const Socket = io.connect(`http://localhost:3010`);

const ChatRoom = ({ userName, room }) => {
  console.log(userName, room);
  return <div>ChatRoom</div>;
};

export default ChatRoom;
