import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import {
  Button,
  message,
  InputNumber,
  Form,
  Spin,
  Space,
  Avatar,
  Progress,
  Image,
  Card,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Column from "rc-table/lib/sugar/Column";

const { Meta } = Card;

function MyPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [percent, setPercent] = useState(70.5);
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

  setTimeout(() => {
    setPercent(36.5);
  }, 3000);

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
      <Row>
        <Col className="gutter-row" id="first-row" span={24}>
          <div id="profile-container">
            <div id="profile-img">
              {user.profileImageUrl.startsWith("/") ? (
                user.profileImageUrl == "/" ? (
                  <div id="upload-profile-placeholder">
                    <img src="/images/icons/camera.png"></img>
                  </div>
                ) : (
                  <img
                    width={300}
                    src={`${API_URL}${user.profileImageUrl}`}
                  ></img>
                )
              ) : user.profileImageUrl ? (
                <img width={300} src={`${user.profileImageUrl}`} />
              ) : (
                <div id="upload-profile-placeholder">
                  <img src="/images/icons/camera.png"></img>
                </div>
              )}
            </div>
            <div id="profile-description">
              <Divider />
              <h3>{user.nickname}</h3>
              <h3>{user.email}</h3>
              <Divider />
            </div>
            <div id="profile-icon-container">
              <div className="profile-icon">
                <Link className="product-link" to="/kakaomap">
                  <img src="./images/icons/placeholder.png" />
                  <h5>내동네 설정하기</h5>
                </Link>
              </div>
              <div className="profile-icon">
                <Link className="product-link" to="/myproduct">
                  <img src="./images/icons/shopping.png" />
                  <h5>거래 내역</h5>
                </Link>
              </div>
              <div className="profile-icon">
                <Link className="product-link" to="/mypageupdate">
                  <img src="./images/icons/cogwheel.png" />
                  <h5>프로필 편집</h5>
                </Link>
              </div>
            </div>
            <Divider />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default MyPage;
