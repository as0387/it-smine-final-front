/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { login } from "../store";
import { useDispatch } from "react-redux";
import { API_URL } from "../config/constants";
import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";

function LoginPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    axios
      .post(`${API_URL}/login`, {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        // 로컬 스토리지 저장
        const contents = res.headers.authorization;
        localStorage.setItem("Authorization", contents);
        console.log(localStorage.getItem("Authorization"));
        return res;
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "ok") {
          // 로그인 상태 값 리덕스 저장
          dispatch(login());
          history.push("/");
        } else {
          message.error("아이디 혹은 비번을 다시 입력하세요!");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  const config = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  const responseGoogle = (response) => {
    console.log(1, response);
    axios
      .post(`${API_URL}/oauth/jwt/google`, JSON.stringify(response), config)
      .then((res) => {
        if (res.status === 200) {
          console.log(2, res.data);
          localStorage.setItem("Authorization", res.data);
          dispatch(login());
          history.push("/");
        }
      });
  };

  const responseKakao = (response) => {
    console.log(1, response);
    axios
      .post(`${API_URL}/oauth/jwt/kakao`, JSON.stringify(response), config)
      .then((res) => {
        if (res.status === 200) {
          console.log(2, res.data);
          localStorage.setItem("Authorization", res.data);
          dispatch(login());
          history.push("/");
        }
      });
  };

  return (
    <div id="login-container">
      <img id="logo" src="/images/icons/잇츠마인.png" width="150" />
      <Form
        id="login-form"
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item className="info-message">
          <Button
            id="login-area"
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            로그인
          </Button>
          회원이 아니신가요? <a href="/register"> 회원가입</a>
        </Form.Item>
      </Form>
      <div id="social-login">
        <div className="social-area">
          <GoogleLogin
            className="google-login-btn"
            clientId="174200957989-fh45d11ihpurgl9j65ea8dsjm5cannml.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GoogleLogin
          </GoogleLogin>
        </div>
        <div>
          <KakaoLogin
            className="kakao"
            token={"1be9d08861ba0765ac05ea71c635e4a4"}
            onSuccess={responseKakao}
            onFail={responseKakao}
            getProfile={true}
            render={({ onClick }) => {
              return (
                <a
                  className="social-area"
                  onClick={(e) => {
                    e.preventDefault();
                    onClick();
                  }}
                >
                  <img src="/images/icons/kakao.png" />
                </a>
              );
            }}
          ></KakaoLogin>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
