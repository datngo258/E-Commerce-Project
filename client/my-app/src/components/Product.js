import React, { useState } from "react";
import { formatMoney } from "../ultils/helpers";
import label from "../assets/label.png";
import labelBlue from "../assets/label-blue.png";
import { renderStarFromNumber } from "../ultils/helpers";
import SelectOption from "./SelectOption";
import icons from "../ultils/icons";
import { Link } from "react-router-dom";
import path from "../ultils/path";
const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false);
  return (
    <div className="w-full text-base px-[10px]">
      <Link
        className="w-full border p-[15px] flex flex-col items-center"
        to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
              <SelectOption icon={<AiFillEye />} />
              <SelectOption icon={<AiOutlineMenu />} />
              <SelectOption icon={<BsFillSuitHeartFill />} />
            </div>
          )}
          <img
            src={
              productData?.thumb ||
              "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png"
            }
            alt=""
            className="w-[274px] h-[274px]  object-cover"
          />
          <img
            src={isNew ? label : labelBlue}
            alt=""
            className={`absolute w-[120px] top-[-32px] left-[-42px] object-contain`}
          />
          <span
            className={`font-bold top-[-10px] left-[-12px] text-white absolute ${
              isNew ? "" : "text-sm"
            }`}
          >
            {isNew ? "New" : "Trending"}
          </span>
        </div>
        <div className="flex flex-col mt-[15px] items-start gap-1 w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)?.map(
              (el, index) => (
                <span key={index}>{el}</span>
              )
            )}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Product;
