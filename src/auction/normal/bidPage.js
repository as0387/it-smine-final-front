import React, { useState } from "react";
import { Modal, Button, Form, InputNumber, message, Statistic } from "antd";
import { List, Card, Divider } from "antd";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import { API_URL } from "../../config/constants";
import dayjs from "dayjs";
import "./bidPage.css";

const { Countdown } = Statistic;

const App = (props) => {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams();
  const userId = props.userId;
  const product = props.product;
  const history = useHistory();

  var timerSet = product.createDate;
  const deadline =
    new Date(timerSet).getTime() + 1000 * 60 * 60 * 24 * product.endTime; // 타이머 변수

  function onFinish() {
    console.log("finished!");
  } //경매 타이머 끝나면 실행되는 함수임

  const showModal = () => {
    console.log(props);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkBidder = () => {
    if (product.bidder == null) {
      return "입찰자 없음";
    }
    let bidder = product.bidder.nickname;
    return bidder;
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
      content: product.user.nickname,
    },
    {
      title: "판매 지역",
      content: "서울",
    },
    {
      title: "현재가 및 낙찰예정자",
      content: `${product.bid}원 : ${checkBidder()}`,
    },
    {
      title: "상한가(즉시구매가) 및 최소 입찰 단위",
      content: `${product.bidLimit}원 / ${product.minBidUnit}`,
    },
  ];
  const bidPost = (values) => {
    if (product.bid > parseInt(values.bid)) {
      message.error(`입찰금액이 현재 가격보다 낮습니다...`);
    } else if (product.bidder != null) {
      if (product.bidder.id === userId)
        message.error(`이미 입찰 하셨습니다.....`);
    } else if (product.user.id === userId) {
      message.error(`본인의 상품은 입찰하실 수 없습니다......`);
    } else {
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
      <Divider />
      <Countdown
        title="남은시간:"
        value={deadline}
        valueStyle={{ fontSize: 23 }}
        onFinish={onFinish}
        format="D 일 H : m : s"
      />
      <Divider />
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
              <Card title={item.title} style={{ fontSize: 25 }}>
                {item.content}
              </Card>
            </List.Item>
          )}
        />
        💰입찰 정보 입력
        <Form onFinish={bidPost} style={{ paddingTop: 30 }}>
          <Form.Item
            name="bid"
            label={<div className="upload-label">입찰가격(원)</div>}
            rules={[
              { required: true, message: "ㅤㅤ입찰 가격을 입력해주세요" },
              {
                required: function () {},
                message: "최소 입찰 단위에 맞게 입찰해 주세요! ",
              },
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
            입찰 하기
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
          즉시 구매
        </Button>
      </Modal>
    </>
  );
};

export default App;
