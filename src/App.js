import "antd/dist/antd.css";
import "./App.css";
import React from "react";
import MainPageComponent from "./main/index.js";
import UploadPage from "./upload";
import AuctionUpload from "./auctionupload";
import ProductPage from "./product";
import LoginPage from "./login/index";
import RegisterPage from "./register/index";
import MyPage from "./mypage/index";
import MypageUpdatePage from "./mypageUpdate";
import Kakaomap from "./kakaomap/kakao";
import Myproduct from "./myproduct/index";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import {
  Spin,
  Space,
  Avatar,
  Button,
  Affix,
  Menu,
  Dropdown,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { API_URL } from "./config/constants";
import axios from "axios";
import {
  CarOutlined,
  ThunderboltOutlined,
  CameraOutlined,
  HeartOutlined,
  SkinOutlined,
  LaptopOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { login, logout } from "./store";
import { useDispatch, useSelector } from "react-redux";
import UpdateForm from "./updateForm";
import ChatPage from "./chat";

function App() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const history = useHistory();
  const dispatch = useDispatch();

  const isLogin = useSelector((store) => store.isLogin);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    let jwtToken = localStorage.getItem("Authorization");
    if (jwtToken !== null) {
      dispatch(login());
    }
  }, []);

  const upload = function () {
    if (!isLogin) {
      message.error("로그인 후 이용해 주세요!");
      history.push("/login");
    } else {
      history.push("/upload");
    }
  };

  const auctionupload = () => {
    if (!isLogin) {
      message.error("로그인 후 이용해 주세요!");
      history.push("/login");
    } else {
      history.push("/auctionupload");
    }
  };

  const logoutProc = () => {
    localStorage.removeItem("Authorization");
    dispatch(logout());
    history.push("/");
  };

  const mypageProc = () => {
    history.push("/mypage");
  };

  const chatpageProc = () => {
    history.push("/chatpage");
  };

  //
  const menu = (
    <Menu>
      <Menu.Item icon={<SkinOutlined />} key="1">
        의류
      </Menu.Item>
      <Menu.Item icon={<HeartOutlined />} key="1">
        신발,가방,잡화
      </Menu.Item>
      <Menu.Item icon={<LaptopOutlined />} key="1">
        컴퓨터,주변기기
      </Menu.Item>
      <Menu.Item icon={<CameraOutlined />} key="1">
        카메라
      </Menu.Item>
      <Menu.Item icon={<ThunderboltOutlined />} key="1">
        디지털,가전
      </Menu.Item>
      <Menu.Item icon={<CarOutlined />} key="1">
        자동차
      </Menu.Item>
    </Menu>
  );
  const menu2 = (
    <Menu>
      <Menu.Item onClick={upload} key="1" icon={<PlusOutlined />}>
        일반상품
      </Menu.Item>
      <Menu.Item onClick={auctionupload} key="2" icon={<PlusOutlined />}>
        경매상품
      </Menu.Item>
    </Menu>
  );

  const menu3 = (
    <Menu>
      <Menu.Item>
        <a onClick={mypageProc}>내정보</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={chatpageProc}>1:1 채팅</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Affix offsetTop={0}>
        <div id="header">
          <div id="header-area">
            <Link to="/">
              <img id="logo" src="/images/icons/잇츠마인.png" width="" />
            </Link>
            {isLogin ? (
              <>
                <div>
                  <Dropdown overlay={menu3} placement="bottomLeft" arrow>
                    <Button size="large" className="k-button3">
                      <img id="profile" src="/images/icons/avatar.png" />
                      내정보
                    </Button>
                  </Dropdown>
                  <Button
                    size="large"
                    onClick={logoutProc}
                    className="k-button3"
                  >
                    로그아웃
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Button
                    className="k-button3"
                    size="large"
                    onClick={function () {
                      history.push("/login");
                    }}
                  >
                    로그인
                  </Button>

                  <Button
                    size="large"
                    className="k-button3"
                    onClick={function () {
                      history.push("/register");
                    }}
                  >
                    회원가입
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div id="header-cat">
          <div id="header-area-cat">
            <>
              <div>
                <Dropdown overlay={menu}>
                  <Button
                    className="k-button2"
                    size="large"
                    icon={<DownOutlined />}
                  >
                    카테고리
                  </Button>
                </Dropdown>
              </div>
            </>
            <>
              <Dropdown overlay={menu2}>
                <Button
                  className="k-button"
                  size="large"
                  type="primary"
                  icon={<PlusOutlined />}
                >
                  상품 업로드
                </Button>
              </Dropdown>
            </>
          </div>
        </div>
      </Affix>

      <div id="body">
        <Switch>
          <Route exact={true} path="/">
            <MainPageComponent />
          </Route>
          <Route exact={true} path="/products/:id">
            <ProductPage />
          </Route>
          <Route exact={true} path="/upload">
            <UploadPage />
          </Route>
          <Route exact={true} path="/auctionupload">
            <AuctionUpload />
          </Route>
          <Route exact={true} path="/login">
            <LoginPage />
          </Route>
          <Route exact={true} path="/register">
            <RegisterPage />
          </Route>
          <Route exact={true} path="/mypage">
            <MyPage />
          </Route>
          <Route exact={true} path="/kakaomap">
            <Kakaomap />
          </Route>
          <Route exact={true} path="/mypageupdate">
            <MypageUpdatePage />
          </Route>
          <Route exact={true} path="/myproduct">
            <Myproduct />
          </Route>
          <Route exact={true} path="/updateForm/:id">
            <UpdateForm />
          </Route>
          <Route exact={true} path="/chatpage">
            <ChatPage />
          </Route>
        </Switch>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
