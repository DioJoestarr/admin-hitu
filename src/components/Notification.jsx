import React, {useState, useEffect} from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { chatData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import "./main.scss";

const Notification = () => {
  const { currentColor } = useStateContext();

  const [notifications, setNotifications] = useState([]);

  const getData = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };
    const {
      data: { data },
    } = await axios.get(
      "http://18.140.66.234/api/v1/notifications/page?page=1&size=5",
      config
    );
    setNotifications(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="border-[1px] nav-item absolute right-[0px] md:right-[62px] top-[60px] bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Thông Báo</p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange-theme "
          >
            {" "}
            ({notifications.length} mới)
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="mt-5 ">
        {notifications?.map((item, index) => (
          <div
            key={index}
            className="max-h-[95px] flex items-center leading-8 gap-5 border-b-1 border-color p-3"
          >
            <img
              className="rounded-full h-[40px] w-[40px]"
              src={`http://18.140.66.234${item.thumbnail}`}
              alt={item.message}
            />
            <div>
              <div className="overflow-hidden w-[100%]">
                <p className="title_preview font-semibold dark:text-gray-200 ">
                  {item.title}
                </p>
                {/* <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{item.time}</p> */}
              </div>
            </div>
          </div>
        ))}
        {/* <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Notification;
