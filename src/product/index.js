import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, InputNumber, Form, Spin, Space } from "antd";
import ProductCard from "../components/productCard";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import Comment from "../comments/index";

const config = {
  headers: { Authorization: localStorage.getItem("Authorization") },
};

function ProductPage() {
  const { id } = useParams();
  const [userId, setuserId] = useState();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const history = useHistory();

  const getProduct = () => {
    axios
      .get(`${API_URL}/products/${id}`, config)
      .then((result) => {
        setProduct(result.data);
      })
      .catch((error) => {
        console.error("에러!", error);
      });
  };

  const getRecommendations = () => {
    axios
      .get(
        `https://itsmine-recommend-server.herokuapp.com/products/${id}/recommendation`
      )
      .then((result) => {
        setProducts(result.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deletePost = (postId) => {
    axios
      .delete(`${API_URL}/post/${id}`, config)
      .then((result) => {
        alert("삭제완료");
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  useEffect(
    function () {
      let jwtTokenTemp = localStorage.getItem("Authorization");

      if (jwtTokenTemp === null) {
        message.error("로그인 후 이용가능합니다!");
        history.push("/login");
      } else {
        let jwtToken = jwtTokenTemp.replace("Bearer ", "");
        getProduct();
        getRecommendations();
        setuserId(jwt_decode(jwtToken).id);
      }
    },
    [id, product]
  );

  const bidPost = (values) => {
    if (product.bid > parseInt(values.bid)) {
      message.error(`입찰금액이 현재 가격보다 낮습니다...`);
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
          console.log(result);
          message.success("입찰되었습니다!");
          history.replace(`/products/${id}`);
        })
        .catch((error) => {
          console.error(error);
          message.error(`에러가 발생했습니다. ${error.message}`);
        });
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

  const onClickPurchase = () => {
    axios
      .post(`${API_URL}/purchase/${id}`)
      .then((result) => {
        message.info("구매가 완료되었습니다.");
        getProduct();
      })
      .catch((error) => {
        message.error(`에러가 발생했습니다. ${error.message}`);
      });
  };

  return (
    <div>
      <div id="image-box">
        <img src={`${API_URL}${product.imageUrl}`} />
      </div>

      <div id="profile-box">
        <div>
          <img src="/images/icons/avatar.png" />
          <span>{product.user.username}</span>
        </div>
        {product.user.id === userId ? (
          <div id="change-button">
            <Link to={"/updateForm/" + product.id}>
              <Button id="change-button1" size="middle" type="primary">
                수정
              </Button>
            </Link>

            <Button
              size="middle"
              type="primary"
              danger
              onClick={() => deletePost(product.id)}
            >
              삭제
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      <div id="contents-box">
        <div>
          <div id="name">{product.title}</div>
          {product.type !== 1 ? (
            <div id="price">{product.price}원</div>
          ) : (
            <div id="price">{product.bid}원</div>
          )}

          <div id="createdAt">
            {dayjs(product.createdAt).format("YYYY년 MM월 DD일")}
          </div>
          {product.type === 1 ? (
            <div>
              <div>
                <div id="auction-commit">
                  <Form onFinish={bidPost}>
                    <Form.Item
                      name="bid"
                      label={<div className="upload-label">입찰 가격(원)</div>}
                      rules={[
                        { required: true, message: "상품 가격을 입력해주세요" },
                      ]}
                    >
                      <InputNumber
                        className="upload-price"
                        size="large"
                        defaultValue={0}
                      ></InputNumber>
                    </Form.Item>
                    <Button
                      id="bill-button"
                      size="large"
                      type="primary"
                      danger
                      htmlType
                    >
                      입찰하기
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <Button
                  id="purchase-button"
                  size="large"
                  type="primary"
                  danger
                  onClick={onClickPurchase}
                  disabled={product.soldout === 1 ? true : false}
                >
                  재빨리 구매하기
                </Button>
              </div>
            </div>
          )}
          <br />
          <br />
          <div id="price">상품 설명</div>
          <pre id="description">{product.description}</pre>
        </div>
      </div>
      <div>
        <h1>추천 상품</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {products.map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
        </div>
      </div>
      <Comment />
    </div>
  );
}

export default ProductPage;
