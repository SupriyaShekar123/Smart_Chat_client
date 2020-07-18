import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Voice from "../Voice";
import "./Chat.css";
import Input from "../Input/Input";
import Text from "../Text/Text";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "https://project-chat-application.herokuapp.com/";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className='chat_container '>
      <div className='inner_container'>
        {/* <InfoBar room={room} />
        <Messages messages={messages} name={name} /> */}
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />

        <Voice />
      </div>
      <Text users={users} />
    </div>
  );
};

export default Chat;
