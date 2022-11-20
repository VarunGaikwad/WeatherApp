import React from "react";
import "./otherElement.css";

export default function OtherElement({ icon, unit }) {
  return (
    <div className="OtherElement__Content">
      <p>
        <img width={25} src={icon} alt="Wind"></img>
      </p>
      <p style={{ marginLeft: "10px" }}>{unit}</p>
    </div>
  );
}
