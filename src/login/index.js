import { Form, Input, Checkbox, Button, message, Image } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./index.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { login } from "../store";
import { useDispatch } from "react-redux";
import { API_URL } from "../config/constants";

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
          history.replace("/");
        } else {
          message.error("아이디 혹은 비번을 다시 입력하세요!");
        }
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  return (
    <div>
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

      <Form.Item>
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
          <div>
          <a className="social-area">
            <img src="/images/icons/kakao.png"/>
          </a> 
          </div>
        <div>
          <Button
          className="social-area"
          type="primary"
        >
          로그인
        </Button>
        </div>
    
        <div>
          <Button
          className="social-area"
          type="primary"
        >
          로그인
        </Button>
        </div>
        <div>
          <Button
          className="social-area"
          type="primary"
        >
          로그인
        </Button>
          </div>
        </div>
    </div>
  );
}

export default LoginPage;