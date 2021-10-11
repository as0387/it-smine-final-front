import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { useCallback, useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import PicturesWall from "../picturesWall";

const { Option } = Select;
var fileIdList = [];
var priceTest = 0;
var bidLimitTest = 0;

function handleChange(value) {
  console.log(value);
  bidLimitTest = parseInt(value);
}

function AuctionUpload() {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: localStorage.getItem("Authorization"),
    },
  };
  const [fileIds, setFileIds] = useState([]);

  const history = useHistory();

  const limtCheck = useCallback((_, value) => {
    let limitPrice = parseInt(value);
    if (limitPrice <= priceTest + bidLimitTest) {
      return Promise.reject(
        new Error(
          "상한가가 경매가보다 낮거나 (경매가 + 최소입찰 금액) 보다 낮습니다."
        )
      );
    }
    if (limitPrice % bidLimitTest != 0) {
      return Promise.reject(
        new Error("상한가를 최소 입찰 단위에 나누어 떨어지게 설정해 주세요.")
      );
    }
    return Promise.resolve();
  }, []);

  function priceChange(value) {
    console.log(value);
    for (var a in fileIds) console.log(a);
    priceTest = value;
  }
  const getTextValue = (fileId) => {
    fileIdList.push(fileId);
    setFileIds(fileIdList);
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    const data1 = {
      title: values.title,
      description: values.description,
      endTime: parseInt(values.endTime),
      bid: parseInt(values.bid),
      minBidUnit: parseInt(values.minBidUnit),
      bidLimit: parseInt(values.bidLimit),
      type: 1,
    };
    const data2 = {
      fileIdList: fileIds,
    };
    console.log(JSON.stringify(data2));
    formData.append(
      "post1",
      new Blob([JSON.stringify(data1)], { type: "application/json" })
    );
    formData.append(
      "post2",
      new Blob([JSON.stringify(data2)], { type: "application/json" })
    );
    console.log(formData.get);

    axios
      .post(`${API_URL}/nomalAuctionPost`, formData, config)
      .then((result) => {
        console.log(result);
        history.replace("/");
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  return (
    <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        <Form.Item
          name="upload"
          label={<div className="upload-label">상품 사진</div>}
        >
          <PicturesWall getTextValue={getTextValue} />
        </Form.Item>
        <Divider />
        <Form.Item
          name="title"
          label={<div className="upload-label">상품 이름</div>}
          rules={[{ required: true, message: "상품 이름을 입력해주세요." }]}
        >
          <Input
            className="upload-name"
            size="large"
            placeholder="상품 이름을 입력해주세요."
          ></Input>
        </Form.Item>
        <Divider />
        <Form.Item
          name="endTime"
          label={<div className="upload-label">경매마감시간</div>}
        >
          <Select style={{ width: 120 }} onChange={handleChange}>
            <Option value="1">1일후</Option>
            <Option value="3">3일후</Option>
            <Option value="7">7일후</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="bid"
          label={<div className="upload-label">경매시작가</div>}
          rules={[{ required: true, message: "경매 시작가를 입력해주세요" }]}
        >
          <InputNumber
            className="upload-price"
            size="large"
            onChange={priceChange}
            defaultValue={0}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          name="minBidUnit"
          label={
            <div className="upload-label" id="upload-label2">
              최소 입찰 단위
            </div>
          }
        >
          <Select
            style={{ width: 120 }}
            onChange={handleChange}
            rules={[
              { required: true, message: "최소 입찰 단위를 입력해주세요" },
            ]}
          >
            <Option value="500">500원</Option>
            <Option value="1000">1000원</Option>
            <Option value="5000">5000원</Option>
            <Option value="10000">10000원</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="bidLimit"
          label={<div className="upload-label">상한가</div>}
          rules={[
            { required: true, message: "상한가를 입력해주세요" },
            {
              validator: limtCheck,
            },
          ]}
        >
          <InputNumber
            className="upload-price"
            size="large"
            defaultValue={0}
          ></InputNumber>
        </Form.Item>
        <Divider />
        <Form.Item
          name="description"
          label={<div className="upload-label">상품 소개</div>}
          rules={[{ required: true, message: "상품 소개를 입력해주세요." }]}
        >
          <Input.TextArea
            size="large"
            id="product-description"
            showCount
            maxLength={500}
            placeholder="상품 소개를 적어주세요. 내용은 최대 500자 입니다."
            style={{ width: 500 }}
          ></Input.TextArea>
        </Form.Item>
        <Form.Item>
          <Button id="submit-button" size="large" htmlType>
            상품 업로드
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default AuctionUpload;
