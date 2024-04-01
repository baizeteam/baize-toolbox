import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function App() {
  const navigate = useNavigate();

  const gotoSetting = () => {
    navigate("/setting");
  };

  return (
    <div className="container">
      <div>主页</div>
      <Button onClick={gotoSetting}>goto setting</Button>
    </div>
  );
}

export default App;
