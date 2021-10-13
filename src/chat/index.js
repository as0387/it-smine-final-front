import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Spin, Space, Form, Button, Input } from "antd";
import {} from "react-bootstrap";
import { valueToNode } from "@babel/types";
import { useCallback } from "react";

function ChatPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

  var chatroomid;
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [chats, setChat] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [, updatteState] = useState();
  const forceUpdate = useCallback(() => updatteState({}), []);

  React.useEffect(function () {
    axios
      .get(`${API_URL}/user-info`, config)
      .then((result) => {
        console.log(result);
        //실제 데이터로 변경
        setUser(result.data);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });

    axios
      .get(`${API_URL}/chat-list`, config)
      .then((result) => {
        console.log(result.data);
        setChat(result.data);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);

  const chatRoom = () => {
    console.log(chatroomid);
    axios
      .get(`${API_URL}/chat/${chatroomid}`, config)
      .then((result) => {
        console.log(result.data.messages);
        //실제 데이터로 변경
        setMessages(result.data.messages);
        var objDiv = document.getElementById("chat-content");

        objDiv.scrollTop = objDiv.scrollHeight;
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
    return true;
  };

  const onClickPurchase = (values) => {
    console.log(values.message);
    axios.post(
      `${API_URL}/chat`,
      { writerId: user.id, roomId: chatroomid, message: values.message },
      config
    );
    chatRoom()
      .then((result) => {
        chatRoom();
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (messages === null) {
    return (
      <div id="spin-spin">
        <Space size="middle">
          <Spin size="small" />
          <Spin />
          <Spin size="large" />
        </Space>
      </div>
    );
  }

  return (
    <>
      <div class="container p-4 detail">
        <div class="row">
          <div class="col-3 p-0">
            {chats.map((chat) => {
              chatroomid = chat.chatRoomId;
              setTimeout(chatRoom, 5000);
              clearTimeout(chatRoom);
              return (
                <ul class="list-group chat-list">
                  <Button
                    onClick={chatRoom}
                    class="list-group-item"
                    data-arg1={chat.chatRoomId}
                  >
                    <h6>{chat.opponentUserName} 님과의채팅</h6>
                  </Button>
                </ul>
              );
            })}
          </div>
          <div class="col-9 p-0">
            <div class="chat-room">
              <ul class="list-group chat-content" id="chat-content">
                {messages
                  .map((msg) => {
                    return msg.writer.id == user.id ? (
                      <li>
                        <span class="chat-box mine">{msg.message}</span>
                      </li>
                    ) : (
                      <li>
                        <span class="chat-box">{msg.message}</span>
                      </li>
                    );
                  })
                  .reverse()}
              </ul>
              <div class="input-group">
                <Form onFinish={onClickPurchase}>
                  <Form.Item name="message">
                    <Input
                      className="upload-name"
                      size="large"
                      placeholder="메세지를 입력해주세요."
                    ></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button id="submit" type="primary" size="large" htmlType>
                      전송
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
