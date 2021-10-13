import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Select,
} from "antd";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useHistory } from "react-router-dom";
import PicturesWall from "../picturesWall";

const { Option } = Select;
var fileIdList = [];

function UploadPage() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };

  const history = useHistory();
  const [fileIds, setFileIds] = useState([]);

  const getTextValue = (fileId) => {
    fileIdList.push(fileId);
    setFileIds(fileIdList);
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    const data1 = {
      title: values.title,
      description: values.description,
      price: values.price,
      type: 0,
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
  //추천 서버이니까 나중에 추가하시오.
  // axios
  //   .post(`https://75bee61c1be4.ngrok.io/products`, {
  //     title: values.title,
  //     description: values.description,
  //     price: parseInt(values.price),
  //     imageUrl: imageUrl2,
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     history.replace("/");
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //     message.error(`에러가 발생했습니다. ${error.message}`);
  //   });

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
          name="price"
          label={<div className="upload-label">상품 가격</div>}
          rules={[{ required: true, message: "상품 가격을 입력해주세요" }]}
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
            maxLength={300}
            placeholder="상품 소개를 적어주세요."
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

export default UploadPage;
