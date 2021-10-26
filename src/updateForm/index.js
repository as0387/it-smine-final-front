import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
} from "antd";
import { Spin, Space } from "antd";
import { useEffect, useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";

function UpdateForm() {
  const config = {
    headers: { Authorization: localStorage.getItem("Authorization") },
  };
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrl2, setImageUrl2] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/products/${id}`, config)
      .then((result) => {
        console.log(result);
        setProduct(result.data);
        setImageUrl(result.data.imageUrl);
      })
      .catch((error) => {
        console.error("에러!", error);
      });
  }, []);

  const onSubmit = (values) => {
    axios
      .put(
        `${API_URL}/post/${id}`,
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
      .post(`https://75bee61c1be4.ngrok.io/products`, {
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
            action={`https://75bee61c1be4.ngrok.io/image`}
            listType="picture"
            showUploadList={false}
            onChange={onChangeImage2}
          >
            {imageUrl2 ? (
              <img
                id="upload-img"
                src={`https://75bee61c1be4.ngrok.io/${imageUrl2}`}
              />
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
            defaultValue={`${product.title}`}
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
            defaultValue={`${product.price}`}
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
            defaultValue={`${product.description}`}
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
