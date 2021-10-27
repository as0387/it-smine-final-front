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

import { Link } from "react-router-dom";
import Column from "rc-table/lib/sugar/Column";

function EndPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  React.useEffect(function () {
    axios
      .get(`${API_URL}/live-auction/detail/${id}`, config)
      .then((result) => {
        console.log(result.data);
        setProduct(result.data);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  });

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
  return (
    <>
      <Row>
        <Col className="gutter-row" id="first-row" span={24}></Col>
      </Row>
    </>
  );
}

export default EndPage;
