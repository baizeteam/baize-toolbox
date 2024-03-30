import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function App() {
  const navigate = useNavigate();

  const gotoSetting = () => {
    navigate("/setting");
  };

  const testStore = async () => {
    window.api.setStore("test", "1234");
    const res = await window.api.getStore("test");
    console.log(res);
  };

  return (
    <div className="container">
      <div>主页</div>
      <Button onClick={testStore}>test store</Button>
      <Button onClick={gotoSetting}>goto setting</Button>
    </div>
  );
}

export default App;
