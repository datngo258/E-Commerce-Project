import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../apis/product";
import Product from "./Product";
import CustomSlider from "./CustomSlider";
import { useDispatch, useSelector } from "react-redux";
import { getNewProducts } from "../store/products/asynsActions";

import Slider from "react-slick";

const tabs = [
  { id: 1, name: "best sellers" },
  { id: 2, name: "new arrivals" },
];
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const BestSeller = () => {
  // bán chạy, mới nhất , tab đang chạy , sản phẩm đang hiển thị
  const [bestSellers, setBestSellers] = useState(null);
  // const [newProducts, setNewProducts] = useState(null);
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  // const { newProducts } = useSelector((state) => state.product);
  const { newProducts } = useSelector((state) => state.products || {});
  const fetchProducts = async () => {
    //response là mảng 2 phần từ [ bán chạy nhất, mới nhất  ]
    // const response = await Promise.all([
    //   apiGetProducts({ sort: "-sold" }),
    //   apiGetProducts({ sort: "-createdAt" }),
    // ]);
    // // nếu response[0] có success thì set bestSellers và products
    // if (response[0]?.success) {
    //   setBestSellers(response[0].products);
    //   setProducts(response[0].products);
    // }

    // nếu response[1] có success thì set newProducts
    // if (response[1]?.success) setNewProducts(response[1].products);
    // luôn set products từ response[0]
    // vì mặc định tab đang chạy là 1 (bán chạy nhất)
    //   setProducts(response[0].products);
    // };
    const response = await apiGetProducts({ sort: "-sold" });
    if (response.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
  };

  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);
  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);
  return (
    <div>
      <div className="flex text-[20px] ml-[-32px]">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold uppercase px-8 border-r cursor-pointer text-gray-400 ${
              activedTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
        <CustomSlider products={products} activedTab={activedTab} />
      </div>
      <div className="flex gap-4 mt-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-24_2000x_crop_center.png?v=1750842410"
          alt="Ảnh 1"
          className="w-1/2 object-cover rounded"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/promo-23_2000x_crop_center.png?v=1750842393"
          alt="Ảnh 2"
          className="w-1/2 object-cover rounded"
        />
      </div>
    </div>
  );
};

export default BestSeller;
