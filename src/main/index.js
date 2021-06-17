import "./index.css";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "../config/constants.js";
import { Carousel } from "antd";
import ProductCard from "../components/productCard";

dayjs.extend(relativeTime);

function MainPage() {
  const [products, setProducts] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
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

    axios
      .get(`${API_URL}/getBanners`)
      .then((result) => {
        console.log(result);
        const banners = result.data;
        setBanners(banners);
      })
      .catch((error) => {
        console.error("에러발생 : ", error);
      });
  }, []);

  return (
    <div>
      <Carousel autoplay autoplaySpeed={3000}>
        {banners.map((banner, index) => {
          return (
            <a href={banner.adHref}>
              <div id="banner">
                <img src={`${API_URL}/upload${banner.imageUrl}`} />
              </div>
            </a>
          );
        })}
      </Carousel>
      <h1 id="product-headline">판매상품</h1>
      <div id="product-list">
        {products.map(function (product, index) {
          return (
            <ProductCard product={product} key={index} />
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
