import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Spin, Space } from "antd";
import {} from "react-bootstrap";

function ChatPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const history = useHistory();
  const [user, setUser] = useState(null);
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
  }, []);

  if (user === null) {
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
            <ul class="list-group chat-list">
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
              <button class="list-group-item">
                <h6>채팅방1</h6>
                <h6 class="text-small">채팅방아이디</h6>
              </button>
            </ul>
          </div>
          <div class="col-9 p-0">
            <div class="chat-room">
              <ul class="list-group chat-content">
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box">채팅방1 내용</span>
                </li>
                <li>
                  <span class="chat-box mine">채팅방1 내용</span>
                </li>
              </ul>
              <div class="input-group">
                <input class="form-control" id="chat-input" />
                <button class="btn btn-secondary" id="send">
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
