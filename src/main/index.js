import "./index.css";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "../config/constants.js";
import { Carousel } from "antd";

dayjs.extend(relativeTime);

function MainPage() {
  const [products, setProducts] = React.useState([]);
  const banners = [
    "/banner1.jpg",
    "/banner2.png",
    "/banner3.png",
    "/banner4.png",
  ];
  React.useEffect(function () {
    axios
      .get(`${API_URL}/products`)
      .then((result) => {
        console.log(result);
        const contents = result.data.content;
        setProducts(contents);
      })
      .catch((error) => {
        console.error("에러발생!!", error);
      });
  }, []);

  return (
    <div>
      <Carousel autoplay autoplaySpeed={3000}>
        {banners.map((banner, index) => {
          return (
            <div id="banner">
              <img src={"/banners" + banner} />
            </div>
          );
        })}
      </Carousel>
      <h1 id="product-headline">판매상품</h1>
      <div id="product-list">
        {products.map(function (product, index) {
          return (
            <div className="product-card">
              {product.soldout === 1 && <div className="product-blur" />}
              <Link className="product-link" to={`/products/${product.id}`}>
                <div>
                  <img
                    className="product-img"
                    src={`${API_URL}${product.photos[0].imageUrl}`}
                  />
                </div>
                <div className="product-contents">
                  <span className="product-name">
                    <span>{product.title}</span>
                  </span>
                  <span className="product-price">
                    {product.type === 0 ? (
                      <span>{product.price}원</span>
                    ) : (
                      <span>{product.bid}원</span>
                    )}
                  </span>
                  <div className="product-footer">
                    <div className="product-seller">
                      <img
                        className="product-avatar"
                        src="images/icons/avatar.png"
                      />
                      <span>{product.user.nickname}</span>
                    </div>
                    <span className="product-date">
                      {dayjs(product.createDate).fromNow()}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
