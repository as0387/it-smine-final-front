import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import { Spin, Space, Form, Button, Input } from "antd";
import {} from "react-bootstrap";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import jquery from "jquery";
import $ from "jquery";

var chatroomid;
var opponentUserName;
var stompClient = null;
var sender;

const connect = (values) => {
  disconnect();
  var webSocket = new WebSocket("wss://itsmine.ngrok.io/talk");
  stompClient = Stomp.over(webSocket, { debug: false });
  chatroomid = values.chatroomid;
  opponentUserName = values.opponentUserName;
  sender = values.sender;
  stompClient.connect({}, function () {
    stompClient.subscribe("/topic/" + sender, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log("새로운 메세지가 왔습니다.");
    });
  });
};

const onClickPurchase = (values) => {
  var data = {
    chatRoomId: chatroomid,
    sender: sender,
    receiver: opponentUserName,
    message: values.message,
  };
  stompClient.send("/app/talk/send", {}, JSON.stringify(data));
  showMessageRight(data);
};

function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
}

var space;
function showMessageLeft(e) {
  space = document.getElementById("chat-content");
  let receivedBox = document.createElement("div");
  receivedBox.innerHTML = `<li><span class="chat-box">${e.sender}:${e.message}</span></li>`;
  space.append(receivedBox);

  space.scrollTop = space.scrollHeight;
}
function showMessageRight(e) {
  space = document.getElementById("chat-content");
  let receivedBox = document.createElement("div");
  receivedBox.innerHTML = `<li><span class="chat-box mine">${e.sender}: ${e.message}</span></li>`;
  space.append(receivedBox);
  space.scrollTop = space.scrollHeight;
}

window.onbeforeunload = function (e) {
  disconnect();
};
function ChatPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

  const [user, setUser] = useState();
  const [chats, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
    onReset();
  };
  const onReset = () => {
    setText("");
  };

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

  const chatRoom = (e) => {
    console.log("chatRoom 실행");
    var a1 = Number(e.target.getAttribute("data-msg1"));
    var a2 = e.target.getAttribute("data-msg2");
    var a3 = e.target.getAttribute("data-msg3");
    console.log(a1, a2, a3);
    var data = {
      chatroomid: a1,
      opponentUserName: a2,
      sender: a3,
    };
    connect(data);
    axios
      .get(`${API_URL}/chat/${chatroomid}`, config)
      .then((result) => {
        console.log(result.data.messages);
        //실제 데이터로 변경
        setMessages(result.data.messages);

        var div = document.querySelector("div"); //제거하고자 하는 엘리먼트
        var content = document.getElementById("chat-content"); // 그 엘리먼트의 부모 객체
        content.removeChild(div);

        var objDiv = document.getElementById("chat-content");
        objDiv.scrollTop = objDiv.scrollHeight;
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
    return true;
  };

  if (messages === null || user === null) {
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
      <div className="container p-4 detail">
        <div className="row">
          <div id="chat-list" className="col-3 p-0">
            {chats.map((chat) => {
              console.log(chat);
              return (
                <button
                  data-msg3={`${user.nickname === null ? "" : user.nickname}`}
                  data-msg1={`${chat.chatRoomId}`}
                  data-msg2={`${chat.opponentUserName}`}
                  onClick={chatRoom}
                  id="my-button"
                >
                  {chat.opponentUserName}
                </button>
              );
            })}
          </div>
          <div className="col-9 p-0">
            <div className="chat-room">
              <ul className="list-group chat-content" id="chat-content">
                {messages
                  .map((msg) => {
                    return msg.writer.id === user.id ? (
                      <li>
                        <span className="chat-box mine">
                          {msg.writer.nickname}: {msg.message}
                        </span>
                      </li>
                    ) : (
                      <li>
                        <span className="chat-box">
                          {msg.writer.nickname}: {msg.message}
                        </span>
                      </li>
                    );
                  })
                  .reverse()}
              </ul>
              <div className="input-group">
                <Form onFinish={onClickPurchase}>
                  <Form.Item name="message">
                    <Input
                      id="message-input"
                      size="large"
                      placeholder="메세지를 입력해주세요."
                      onChange={onChange}
                      value={text}
                    ></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      value={text}
                      id="submit"
                      type="primary"
                      size="large"
                      htmlType
                    >
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
