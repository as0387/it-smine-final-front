import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, Result, Spin, Space, message } from "antd";
import { SmileOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import Column from "rc-table/lib/sugar/Column";

function EndPage() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
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
      .get(`${API_URL}/live-auction/detail/${id}`, config)
      .then((result) => {
        console.log(result.data);
        setProduct(result.data);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);

  const onClickPurchase = () => {
    axios
      .post(
        `${API_URL}/chat/newChat`,
        { userId1: user.id, userId2: product.user.id },
        config
      )
      .then((result) => {
        console.log(result.data);
        history.replace(`/chatpage/${result.data}`);
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  if (user === null || product === null) {
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
      {user.id === product.bidder.id ? (
        <Result
          status="success"
          title="축하합니다!! 경매에 최종적으로 낙찰되셨습니다!! 🎉"
          subTitle="판매자와 1:1 채팅을 진행할 수 있습니다."
          extra={[
            <Button onClick={onClickPurchase} type="primary" key="console">
              1:1 채팅하기
            </Button>,
            <Button
              onClick={() => {
                history.replace("/");
              }}
              key="buy"
            >
              메인 화면으로
            </Button>,
          ]}
        />
      ) : (
        <Result
          icon={<SmileOutlined />}
          title="저런! 경매에 낙찰받지 못하셨군요..! 괜찮아 이런날도 있는거지 뭐"
          extra={
            <Button
              onClick={() => {
                history.replace("/");
              }}
              type="primary"
            >
              메인 화면으로
            </Button>
          }
        />
      )}
    </>
  );
}

export default EndPage;
