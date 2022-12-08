import React, { useState } from "react";

const useUserLocal = (keyValue) => {
  let isUserLocal = JSON.parse(localStorage.getItem(keyValue));
  // const [userID, setUserID] = useState("");

  return isUserLocal;
};

export default useUserLocal;
