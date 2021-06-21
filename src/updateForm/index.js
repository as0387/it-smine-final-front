import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useHistory } from "react-router-dom";

const config = {
  headers: { Authorization: localStorage.getItem("Authorization") },
};

function UpdateForm() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const history = useHistory();

  const onSubmit = (values) => {
    axios
      .post(
        `${API_URL}/post`,
        {
          title: values.title,
          description: values.description,
          price: parseInt(values.price),
          imageUrl: imageUrl,
        },
        config
      )
      .then((result) => {
        console.log(result);
        history.replace("/");
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
    axios
      .post(`http://localhost:8080/products`, {
        title: values.title,
        description: values.description,
        price: parseInt(values.price),
        imageUrl: imageUrl2,
      })
      .then((result) => {
        console.log(result);
        history.replace("/");
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };
  const onChangeImage = (info) => {
    console.log(info.file.status);
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const imageUrl = info.file.response;
      setImageUrl(imageUrl);
    }
  };

  const onChangeImage2 = (info) => {
    console.log(info.file.status);
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const response = info.file.response;
      const imageUrl2 = response.imageUrl;
      setImageUrl2(imageUrl2);
    }
  };
  return (
    <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        <Form.Item
          name="upload"
          label={<div className="upload-label">상품 사진</div>}
        >
          <Upload
            name="image"
            action={`${API_URL}/image`}
            listType="picture"
            showUploadList={false}
            onChange={onChangeImage}
          >
            {imageUrl ? (
              <img id="upload-img" src={`${API_URL}${imageUrl}`} />
            ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png"></img>
                <span>이미지를 업로드해주세요.</span>
              </div>
            )}
          </Upload>
          <Upload
            name="image"
            action={`http://localhost:8080/image`}
            listType="picture"
            showUploadList={false}
            onChange={onChangeImage2}
          >
            {imageUrl2 ? (
              <img id="upload-img" src={`http://localhost:8080/${imageUrl2}`} />
            ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png"></img>
                <span>이미지를 업로드해주세요.</span>
              </div>
            )}
          </Upload>
        </Form.Item>

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

export default UpdateForm;
