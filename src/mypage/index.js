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
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

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
      <div id="profile-container">
        <Card
          id="profile-card"
          style={{
            width: 400,
            alignItems: "center",
          }}
          actions={[
            <EditOutlined
              onClick={function () {
                history.push("/mypageupdate");
              }}
              key="edit"
            />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          {user.profileImageUrl.startsWith("/") ? (
            user.profileImageUrl == "/" ? (
              <div id="upload-profile-placeholder">
                <img src="/images/icons/camera.png"></img>
              </div>
            ) : (
              <Image
                id="upload-profile"
                width={300}
                src={`${API_URL}${user.profileImageUrl}`}
              />
            )
          ) : user.profileImageUrl ? (
            <Image width={300} src={`${user.profileImageUrl}`} />
          ) : (
            <div id="upload-profile-placeholder">
              <img src="/images/icons/camera.png"></img>
            </div>
          )}
          <Meta title={user.nickname} description={user.email} />
          <div id="">
            <p>
              <Progress
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#10eee9",
                }}
                percent={percent}
                format={(percent) => `${percent}℃`}
              />
            </p>
          </div>
        </Card>
        <div id="profile-description">
          <div>
            <Button
              id="my-location"
              size="large"
              onClick={function () {
                history.push("/kakaomap");
              }}
            >
              내 동네 설정하기
            </Button>
          </div>

          <div>
            <Button
              id="my-location"
              onClick={function () {
                history.push("/myproduct");
              }}
            >
              일반상품 거래내역
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPage;
