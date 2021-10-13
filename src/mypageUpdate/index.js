import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import {
  Button,
  message,
  InputNumber,
  Form,
  Spin,
  Space,
  Avatar,
  Progress,
  Upload,
  Input,
} from "antd";

function MyPageupdateForm() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
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
  }, []);

  const onSubmit = (values) => {
    console.log(localStorage.getItem("Authorization"));
    var nickname = values.nickname;
    var email = values.email;
    if (nickname == null) {
      nickname = user.nickname;
    }
    if (email == null) {
      email = user.email;
    }
    axios
      .post(
        `${API_URL}/user-update`,
        {
          nickname: nickname,
          email: email,
          imageUrl: imageUrl,
        },
        config
      )
      .then((result) => {
        console.log(result);
        history.replace("/mypage");
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
      user.profileImageUrl = imageUrl;
      setImageUrl(imageUrl);
    }
  };

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
      <Form id="profile-update" name="프로필 편집" onFinish={onSubmit}>
        <Form.Item name="upload">
          <Upload
            name="image"
            action={`${API_URL}/image/profile`}
            listType="picture"
            showUploadList={false}
            onChange={onChangeImage}
          >
            {user.profileImageUrl.startsWith("/") ? (
              user.profileImageUrl ? (
                <img
                  id="upload-profile"
                  src={`${API_URL}${user.profileImageUrl}`}
                />
              ) : (
                <div id="upload-profile-placeholder">
                  <img src="/images/icons/camera.png"></img>
                  <span>이미지를 업로드해주세요.</span>
                </div>
              )
            ) : user.profileImageUrl ? (
              <img id="upload-profile" src={`${user.profileImageUrl}`} />
            ) : (
              <div id="upload-profile-placeholder">
                <img src="/images/icons/camera.png"></img>
                <span>이미지를 업로드해주세요.</span>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="nickname">
          <Input
            className="upload-name"
            size="large"
            placeholder="닉네임을 입력해주세요."
            defaultValue={`${user.nickname}`}
          ></Input>
        </Form.Item>
        <Form.Item name="email">
          <Input
            className="upload-name"
            size="large"
            placeholder="이메일을 입력해주세요."
            defaultValue={`${user.email}`}
          ></Input>
        </Form.Item>
        <Form.Item>
          <Button id="submit" type="primary" size="large" htmlType>
            프로필 저장
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default MyPageupdateForm;
