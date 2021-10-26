import Stomp from "stompjs";
import {
  Button,
  Form,
  Input,
  Image,
  Row,
  Col,
  Statistic,
  Space,
  Spin,
} from "antd";
import jquery from "jquery";
import $ from "jquery";
import { useCallback, useState } from "react";
import "./indexx.css";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import React from "react";
import { Divider } from "rc-menu";
let counttime = Date.now() + 10 * 1000;

const { Search } = Input;
const onSearch = (value) => console.log(value);
const { Countdown } = Statistic;
const deadline = Date.now() + 1.6 * 60 * 60 * 24 * 2 + 1000 * 24; // Moment is also OK
function onFinish() {
  console.log("finished!");
}

function onChange(val) {
  if (4.95 * 1000 < val && val < 5 * 1000) {
    console.log("changed!");
  }
}

//////////////채팅 함수 및 변수모음//////////////

var userName;
var stompClient = null;
var livePostId;

const connect = (values) => {
  disconnect();
  var webSocket = new WebSocket("wss://itsmine.ngrok.io/live");
  stompClient = Stomp.over(webSocket, { debug: false });
  userName = values.userName;
  livePostId = values.productId;
  stompClient.connect({}, function () {
    stompClient.subscribe("/topic/" + livePostId, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log("새로운 메세지가 왔습니다.");
    });
    stompClient.subscribe("/topic/log/" + livePostId, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log("새로운 로그가 왔습니다.");
    });
    stompClient.subscribe("/topic/in/" + livePostId, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log(JSON.parse(e.body), "새로운 사람이 입장했습니다.");
    });
    stompClient.subscribe("/topic/out/" + livePostId, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log(JSON.parse(e.body), "사람이 나갔습니다.");
    });
    stompClient.subscribe("/topic/bidInfo/" + livePostId, function (e) {
      showMessageLeft(JSON.parse(e.body));
      console.log("새로운 경매정보가 왔습니다.");
    });
  });
};

//경매 채팅 샌드 함수
const onClickChatSend = (values) => {
  var data = {
    livePostId: livePostId,
    sender: userName,
    message: values.message,
  };
  stompClient.send("/app/live/send", {}, JSON.stringify(data));
  showMessageRight(data);
};

//경매 입찰 샌드 함수
const onClickBidSend = (values) => {
  var data = {
    price: values.price,
  };
  stompClient.send("/app/live/bidding/send", {}, JSON.stringify(data));
};

//전광판 정보 받는 함수
const onClickBidInfoSend = (values) => {
  var data = {
    livePostId: livePostId,
    bidder: null,
    price: null,
  };
  stompClient.send("/app/live/bidInfo/send", {}, JSON.stringify(data));
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

////////////채팅 함수 모음////////////////

function LiveAuctionPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

  const [user, setUser] = useState();
  const [product, setProduct] = useState(null);
  const [chats, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  React.useEffect(function () {
    axios
      .get(`${API_URL}/user-info`, config)
      .then((result) => {
        console.log(result);
        //실제 데이터로 변경
        userName = result.data.nickname;
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
    axios
      .get(`${API_URL}/live-auction/detail/${id}`, config)
      .then((result) => {
        console.log(result.data);
        setProduct(result.data);
        connect();
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);

  if (product === null) {
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

  const auctionStart = () => {
    deadline = Date.now() + 1.6 * 60 * 60 * 24 * 2 + 1000 * 24;
    // axios
    //   .get(`${API_URL}/live-auction/start/${id}`, config)
    //   .then((result) => {
    //     console.log(result.data);
    //     setProduct(result.data);
    //   })
    //   .catch((error) => {
    //     console.error("에러발생!!", error);
    //   });
  };

  return (
    <div>
      <div className="product-container">
        <Row>
          <Col className="gutter-row" id="first-row" span={6}>
            <Image
              id="img"
              width={300}
              src={
                "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              }
            />
            <Col span={12}>
              <Countdown
                id="count"
                title="남은시간"
                value={counttime}
                onChange={onChange}
              />
            </Col>
            <div id="descriptions">
              <h1>상품이름</h1>
              <h3>닉네임</h3>
              <h2>상품설명</h2>
            </div>

            {/* <h1>{product.title}</h1>
            <h3>{product.user.nickname}</h3>
            <h2>{product.description}</h2> */}
          </Col>

          <Col className="gutter-row" id="second-row" span={8}>
            <div id="des-container">
              <h3>현재 낙찰가</h3>
              <h1>100,000,000원</h1>
              <h1>임동혁 님</h1>
            </div>

            <ul className="list-group chat-contenttt" id="chat-content">
              <li>
                <span className="chat-box mine">안녕하세요</span>
              </li>
              <li>
                <span className="chat-box">하이하이</span>
              </li>
              <li>
                <span className="chat-box">얼마에파시나요?</span>
              </li>
            </ul>

            <Button
              id="first--Button"
              className="second-button"
              type="primary"
              size="large"
            >
              자동입찰
            </Button>

            <Search
              placeholder="input search text"
              onSearch={onSearch}
              enterButton="입찰"
              size="large"
              className="second-button"
              id="search"
            />

            <Button
              type="danger"
              id="third-button"
              className="second-button"
              size="large"
              onClick={auctionStart}
            >
              경매시작
            </Button>
          </Col>
          <Col className="gutter-row" id="third-row" span={7}>
            <div className="chat-container">
              <div className="chat-room">
                <ul className="list-group chat-contentt" id="chat-content"></ul>

                <Form>
                  <Form.Item name="message">
                    <Input
                      size="large"
                      placeholder="메세지를 입력해주세요."
                    ></Input>
                  </Form.Item>
                  <Form.Item>
                    <Button id="submit-2" type="primary" size="large" htmlType>
                      전송
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LiveAuctionPage;
