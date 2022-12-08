import React, { useState } from "react";

const removeUser = (keyValue) => {
  let removeUser = JSON.parse(localStorage.removeItem(keyValue));
  return removeUser;
}

export default removeUser;
