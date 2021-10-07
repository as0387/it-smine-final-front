import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import {useState} from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, InputNumber, Form, Spin, Space, Avatar, Progress } from "antd";
import {UserOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import { Link } from "react-router-dom";


function MyPage() {
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
            <div>
            {
            user.profileImageUrl.startsWith("/") ? (
              user.profileImageUrl == "/" ? (
                <div id="upload-profile-placeholder">
                <img src="/images/icons/camera.png"></img>
                <span>이미지를 업로드해주세요.</span>
                </div>
            ) : (
              <img id="upload-profile" src={`${API_URL}${user.profileImageUrl}`} />
            )
            ) : (
              user.profileImageUrl ? (
              <img id="upload-profile" src={`${user.profileImageUrl}`} />
            ) : (
              <div id="upload-profile-placeholder">
                <img src="/images/icons/camera.png"></img>
                <span>이미지를 업로드해주세요.</span>
              </div>
            )
            )
            }
            <p>유저 이름 : {user.nickname}</p>
            <p>이메일 : {user.email}</p>
            <p>보유 포인트 : {"30000"}</p>
            <p>매너 온도</p>
            <Progress
                strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#10eee9',
                }}
                percent={80.9}
                status ="active"
                
            />
            </div>
            <div>
                <Button
                    size="large"
                    onClick={function () {
                      history.push("/mypageupdate");
                    }}
                  >
                    프로필 편집
                  </Button>
            </div>
            <div>
                <Button
                    size="large"
                    onClick={function () {
                      history.push("/kakaomap");
                    }}
                  >
                    내 동네 설정하기
                  </Button>
            </div>
            
            <div id="tradelist-button">
                <div>
                    <ShoppingCartOutlined />
                    <Button
                    onClick= {function() {
                      history.push("/myproduct");
                    }
                    }
                    >일반상품 거래내역</Button>
                </div>
                <div>
                    <ShoppingCartOutlined />
                    <Button>경매상품 거래내역</Button>
                </div>
                <div>
                    <ShoppingCartOutlined />
                    <Button>실시간 경매 낙찰내역</Button>
                </div>
                
                
            </div>

            
            
    </>
  );
}

export default MyPage;
