import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { getLoggedInfoAsync } from "../Redux/Slices/UserAuthSlice";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
};

export default Home;
