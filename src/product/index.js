import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants";
import dayjs from "dayjs";
import { Button, message, Spin, Space } from "antd";
import ProductCard from "../components/productCard";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";

const config = {
  headers: { Authorization: localStorage.getItem("Authorization") },
};

function ProductPage() {
  const { id } = useParams();
  const [userId, setuserId] = useState();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const getProduct = () => {
    axios
      .get(`${API_URL}/products/${id}`, config)
      .then((result) => {
        console.log(result);
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
        console.log(result.data.products);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(
    function () {
      let jwtTokenTemp = localStorage.getItem("Authorization");
      let jwtToken = jwtTokenTemp.replace("Bearer ", "");
      getProduct();
      getRecommendations();
      setuserId(jwt_decode(jwtToken).id);
    },
    [id]
  );

  if (product === null) {
    return (
      <div>
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
              <Button id="change-button1" size="small" type="primary">
                수정
              </Button>
            </Link>

            <Button size="small" type="primary" danger>
              삭제
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>

      <div id="contents-box">
        <div id="name">{product.title}</div>
        <div id="price">{product.price}원</div>
        <div id="createdAt">
          {dayjs(product.createdAt).format("YYYY년 MM월 DD일")}
        </div>
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
        <pre id="description">{product.description}</pre>
      </div>
      <div>
        <h1>추천 상품</h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {products.map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
