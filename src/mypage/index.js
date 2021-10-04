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
  const history = useHistory();
  const [user, setUser] = useState();
  React.useEffect(function () {
    axios
      .get(`${API_URL}/user-info`)
      .then((result) => {
        console.log(result);
        //실제 데이터로 변경
        const contents = result.data.content;
        setUser(contents);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);
  return (
      <>
            <div>
            <Avatar shape="square" size={128} icon={<UserOutlined />} />
            <p>유저 이름 : {"임동혁"}</p>
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
            
            <div id="tradelist-button">
                <div>
                    <ShoppingCartOutlined />
                    <Button>일반상품 거래내역</Button>
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
