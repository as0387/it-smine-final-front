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
import Stomp from "stompjs";

let counttime = Date.now() + 10 * 1000;

const { Search } = Input;
const { Countdown } = Statistic;
const deadline = Date.now() + 1.6 * 60 * 60 * 24 * 2 + 1000 * 24; // Moment is also OK
var count = 0;
var stompClient = null;

function onFinish() {
  console.log("finished!");
}

function onChange(val) {
  if (4.95 * 1000 < val && val < 5 * 1000) {
    console.log("changed!");
  }
}

//////////////채팅 함수 및 변수모음//////////////

function LiveAuctionPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  var userName;

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
      .get(`${API_URL}/live-auction/detail/${id}`, config)
      .then((result) => {
        console.log(result.data);
        setProduct(result.data);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);

  if (product === null || user === null) {
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

  const connect = () => {
    count++;
    userName = user.nickname;
    var webSocket = new WebSocket("wss://itsmine.ngrok.io/live");
    if (stompClient == null && 2 > count > 0) {
      stompClient = Stomp.over(webSocket);
      stompClient.connect({}, function () {
        stompClient.subscribe("/topic/" + id, function (e) {
          if (JSON.parse(e.body).sender !== userName) {
            showMessageLeft(JSON.parse(e.body));
          }
          console.log("새로운 메세지가 왔습니다.");
        });
        stompClient.subscribe("/topic/log/" + id, function (e) {
          showMessageLog(e.body);
          console.log("새로운 로그가 왔습니다.");
        });
        stompClient.subscribe("/topic/in/" + id, function (e) {
          showMessageIn(JSON.parse(e.body));
          console.log(JSON.parse(e.body), "새로운 사람이 입장했습니다.");
        });
        stompClient.subscribe("/topic/out/" + id, function (e) {
          showMessageLeft(JSON.parse(e.body));
          console.log(JSON.parse(e.body), "사람이 나갔습니다.");
        });
        stompClient.subscribe("/topic/bidInfo/" + id, function (e) {
          showMessageBidInfo(JSON.parse(e.body));
          console.log("새로운 경매정보가 왔습니다.");
        });
        let data = {
          livePostId: id,
          sender: userName,
          message: "님이 입장하셨습니다.",
        };
        stompClient.send("/app/live/in", {}, JSON.stringify(data));
      });
    }
  };

  //경매 채팅 샌드 함수
  const onClickChatSend = (values) => {
    let data = {
      livePostId: id,
      sender: userName,
      message: values.message,
    };
    if (stompClient != null) {
      stompClient.send("/app/live/send", {}, JSON.stringify(data));
      showMessageRight(data);
    }
  };

  //경매 입찰 샌드 함수
  const onClickBidSend = (values) => {
    var data = {
      livePostId: parseInt(id),
      sender: user.id,
      price: parseInt(values),
    };
    stompClient.send("/app/live/bidding/send", {}, JSON.stringify(data));
    // onClickBidInfoSend();
  };

  //전광판 정보 받는 함수
  const onClickBidInfoSend = (values) => {
    var data = {
      livePostId: id,
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
    space = document.getElementById("chat-content-message");
    let receivedBox = document.createElement("div");
    receivedBox.innerHTML = `<li><span class="chat-box">${e.sender}:${e.message}</span></li>`;
    space.append(receivedBox);

    space.scrollTop = space.scrollHeight;
  }

  function showMessageRight(e) {
    space = document.getElementById("chat-content-message");
    let receivedBox = document.createElement("div");
    receivedBox.innerHTML = `<li><span class="chat-box mine">${e.sender}: ${e.message}</span></li>`;
    space.append(receivedBox);
    space.scrollTop = space.scrollHeight;
  }

  function showMessageIn(e) {
    space = document.getElementById("chat-content-message");
    let receivedBox = document.createElement("div");
    receivedBox.innerHTML = `<li><span>${e.sender} ${e.message}</span></li>`;
    space.append(receivedBox);
    space.scrollTop = space.scrollHeight;
  }

  function showMessageBidInfo(e) {
    space = document.getElementById("auctionBoard");
    space.innerHTML = `<h1>${e.price}원</h1>`;
    space.innerHTML = `<h1>현재 낙찰자 ${e.bidder}님</h1>`;
    space.scrollTop = space.scrollHeight;
  }

  function showMessageLog(e) {
    console.log(e);
    space = document.getElementById("chat-content-log");
    let receivedBox = document.createElement("div");
    receivedBox.innerHTML = `<li><span>${e}</span></li>`;
    space.append(receivedBox);
    space.scrollTop = space.scrollHeight;
  }

  window.onbeforeunload = function (e) {
    //뒤로가거나 새로고침하면 소캣 연결 끊음
    disconnect();
  };
  ////////////채팅 함수 모음////////////////

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
  connect();
  return (
    <div>
      <div className="product-container">
        <Row>
          <Col className="gutter-row" id="first-row" span={6}>
            <Image
              id="img"
              width={300}
              src={API_URL + product.livePhotos[0].imageUrl}
            />
            <Col span={12}>
              <Countdown
                id="count"
                title="남은시간"
                value={counttime}
                onChange={onChange}
              />
            </Col>
            <h1>{product.title}</h1>
            <h3>{product.user.nickname}</h3>
            <h2>{product.description}</h2>
          </Col>

          <Col className="gutter-row" id="second-row" span={8}>
            <h3>현재 낙찰가</h3>
            <div id="auctionBoard">
              <h1>{product.bid}원</h1>
              <h1>잠시만 기다려주세요!</h1>
            </div>

            <ul
              className="list-group chat-contenttt"
              id="chat-content-log"
            ></ul>

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
              onSearch={onClickBidSend}
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
          <Col className="gutter-row" span={7}>
            <div className="chat-container">
              <div className="chat-room">
                <ul
                  className="list-group chat-contentt"
                  id="chat-content-message"
                ></ul>

                <Form onFinish={onClickChatSend}>
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
