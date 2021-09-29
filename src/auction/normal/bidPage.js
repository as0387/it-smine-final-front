import React, { useState } from "react";
import { Modal, Button, Form, InputNumber, message } from "antd";
import { List, Card } from "antd";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import { API_URL } from "../../config/constants";
import dayjs from "dayjs";

const config = {
  headers: { Authorization: localStorage.getItem("Authorization") },
};
const App = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams();
  const userId = props.userId;
  const product = props.product;
  const history = useHistory();

  const showModal = () => {
    console.log(product);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    {
      title: "상품명",
      content: product.title,
    },
    {
      title: "경매 마감일",
      content: dayjs(product.createDate).format("YYYY년 MM월 DD일"),
    },
    {
      title: "판매자명",
      content: product.user.username,
    },
    {
      title: "판매 지역",
      content: "서울",
    },
    {
      title: "현재가 및 낙찰예정자",
      content: `${product.bid}원 : ${product.bidderId}`,
    },
    {
      title: "즉시 구매가",
      content: "100000원",
    },
  ];
  const bidPost = (values) => {
    console.log(values);
    if (product.bid > parseInt(values.bid)) {
      message.error(`입찰금액이 현재 가격보다 낮습니다...`);
    } else {
      console.log("axios");
      axios
        .put(
          `${API_URL}/bidPost/${id}`,
          {
            title: product.title,
            description: product.description,
            bid: parseInt(values.bid),
            bidderId: userId,
            imageUrl: product.imageUrl,
          },
          config
        )
        .then((result) => {
          console.log(result);
          message.success("입찰되었습니다!");
          history.replace(`/products/${id}`);
          handleOk();
        })
        .catch((error) => {
          console.error(error);
          message.error(`에러가 발생했습니다. ${error.message}`);
        });
    }
  };

  return (
    <>
      <Button
        id="bill-button"
        size="large"
        type="primary"
        danger
        htmlType
        onClick={showModal}
      >
        입찰하기
      </Button>
      <Modal
        bodyStyle={{ color: "#3399FF", fontSize: 25 }}
        title="경매 입찰"
        width={1080}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        📰경매 상품 정보
        <List
          style={{ marginTop: 20 }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 3,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title}>{item.content}</Card>
            </List.Item>
          )}
        />
        💰입찰 정보 입력
        <Form onFinish={bidPost} style={{ paddingTop: 30 }}>
          <Form.Item
            name="bid"
            label={<div className="upload-label">입찰가격(원)</div>}
            rules={[
              { required: true, message: "ㅤㅤ상품 가격을 입력해주세요" },
            ]}
            style={{ marginLeft: 40, float: "left" }}
          >
            <InputNumber
              className="upload-price"
              size="large"
              defaultValue={0}
              style={{ width: 250, marginRight: 20, marginLeft: 10 }}
            ></InputNumber>
          </Form.Item>
          <Button
            id="bill-button"
            size="large"
            type="primary"
            primary
            htmlType
            style={{ marginRight: 20, marginLeft: 10, float: "left" }}
          >
            입찰하기
          </Button>
        </Form>
        <Button
          id="bill-button"
          size="large"
          type="primary"
          danger
          htmlType
          onClick=""
          style={{ top: -3, marginLeft: 10 }}
        >
          즉시구매
        </Button>
      </Modal>
    </>
  );
};

export default App;
