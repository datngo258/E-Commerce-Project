import Sidebar from "../../components/Sidebar";
import Banner from "../../components/Banner";
import BestSeller from "../../components/BestSeller";
import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
const Home = () => {
  return (
    <>
      <div className="w-main flex">
        <div className="flex flex-col gap-5 w-[20%] flex-auto">
          <Sidebar />
          <span>Deal daily</span>
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[80%] flex-auto">
          <Banner />
          <BestSeller />
        </div>
      </div>
      <div className="w-full h-[500px]"></div>
    </>
  );
};

export default Home;
