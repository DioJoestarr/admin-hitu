import React, {useEffect, useState} from "react"
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import axios from "axios";
import "./main.scss"

const Chat = () => {
  const [news, setNews] = useState([]);

  const getData = async () => {
    const config = {
      headers: {
        "Authorization": `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };
    const {data: {data}} = await axios.get("http://18.140.66.234/api/v1/news/page?page=1&size=5", config)
    setNews(data);
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="border-[1px] nav-item absolute right-[0px] md:right-[62px] top-[60px] bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Tin Tức</p>
          <button type="button" className="text-black  text-xs rounded p-1 px-2 bg-orange">
            ({news.length} mới)
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
        {news?.map((item, index) => (
          <div key={index} className="max-h-[95px] flex items-center  gap-5 border-b-1 border-color p-3 leading-8 cursor-pointer">
            <div className="image_preview w-[40px]">
              <img
                className="rounded-full h-[40px] w-[40px]"
                src={`http://18.140.66.234${item.thumbnail}`}
                alt={item.message}
              />
              <span
                style={{ background: item.dotColor }}
                className="absolute inline-flex rounded-full h-2 w-2 right-0 -top-1"
              />
            </div>
            <div className="overflow-hidden w-[100%]">
              <p className="title_preview font-semibold dark:text-gray-200 ">{item.title}</p>
              {/* <p className="text-gray-500 dark:text-gray-400 text-sm">{item.desc}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{item.time}</p> */}
            </div>
          </div>
        ))}
        {/* <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all messages"
            borderRadius="10px"
            width="full"
          />
        </div> */}
      </div>
    </div>
  );
};

export default Chat;
