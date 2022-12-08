import React, { useRef, useEffect, useState } from "react";
import NewsAPI from "../../API/NewsAPI";
import "../scss/main.scss";

import updateFormImg from "../../assests/updateForm.png";
import { toast } from "react-toastify";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Select from "react-select";

const UpdateNews = ({
  updateShow,
  setUpdateShow,
  newsId,
  setNewsId,
  keyFresh,
  setKeyFresh,
}) => {
  const confirmRef = useRef();

  // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  const [file, setFile] = useState({ name: "Chọn ảnh" });

  const [activeInput, setActiveInput] = useState(null);
  const [obj, setObj] = useState({});
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [options, setOptions] = useState([]);
  const [optionSelected, setOptionSelected] = useState(null);

  const getNewsData = async (newsId) => {
    const {
      data: { id, content, shortDescription, slug, thumbnail, title },
    } = await NewsAPI.getPageNewsAPI(newsId);
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(content))
      )
    );
    setObj({ ...obj, id, content, shortDescription, slug, thumbnail, title });
  };

  const getFaculty = async () => {
    const { data } = await axios.get(
      "http://18.140.66.234/api/v1/faculties/all?status=true"
    );
    let optionForFaculty = [];
    optionForFaculty.push({ value: "", label: "Tất Cả" });
    data.forEach((item) => {
      optionForFaculty.push({ value: item.code, label: item.name });
    });
    setOptions(optionForFaculty);
  };

  useEffect(() => {
    if (newsId) {
      getNewsData(newsId);
    }
    getFaculty();
  }, [newsId, updateShow]);

  useEffect(() => {}, [updateShow]);

  const handleClose = () => {
    setFile({ name: "Chọn ảnh" });
    setActiveInput(null);
    setNewsId(null);
    setUpdateShow(!updateShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (obj.title === "") {
      toast.error("Tiêu đề không được để trống!");
      return 0;
    }
    if (obj.title.length >= 150) {
      toast.error("Tiêu đề không được lớn hơn 150 kí tự!");
      return 0;
    }
    if (obj.shortDescription === "") {
      toast.error("Mô tả ngắn không được để trống!");
      return 0;
    }
    if (obj.shortDescription.length >= 255) {
      toast.error("Mô tả ngắn không được lớn hơn 255 kí tự!");
      return 0;
    }
    if (editorState.getCurrentContent().getPlainText().length === 0) {
      toast.error("Nội dung không được để trống!");
      return 0;
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("file", file);

    const facultyCodes = () => {
      if (optionSelected?.length > 0) {
        let stringFaculty = "";
        optionSelected.map((item, i) => {
          stringFaculty += "facultyCodes" + "=" + item.value + "&";
        });
        return stringFaculty;
      }
      return "";
    };
    const facultyUrl = facultyCodes();

    try {
      await axios.put(
        `http://18.140.66.234/api/v1/news?${facultyUrl}` +
          new URLSearchParams({
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            id: obj.id,
            shortDescription: obj.shortDescription,
            title: obj.title,
          }),
        bodyFormData,
        config
      );

      setObj("");
      handleClose();
      setKeyFresh((old) => old + 1);
      toast.success("Tin tức vừa được cập nhật thành công!");
    } catch (err) {
      toast.error("Tin tức chưa được cập nhật");
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Modal
        showCloseIcon={false}
        open={updateShow}
        onClose={() => {
          setUpdateShow(false);
        }}
        center={true}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="update-customer">
          <form className="confirmed">
            <div className="p-[20px] h-[645px]">
              <div className="closed" onClick={handleClose}>
                <i className="fa-solid fa-square-xmark"></i>
              </div>
              <div className="heading-confirm">
                <div className="flex justify-center items-center">
                  <img
                    src={updateFormImg}
                    width="170px"
                    height="135px"
                    alt="imgForm"
                  />
                  <h1 className="text-[20px] font-[600]">Chỉnh Sửa Tin tức</h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "update_news_1" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[500] text-[16px]">
                      Tiêu Đề
                    </h3>
                    <input
                      name="title"
                      value={obj.title}
                      onChange={(e) => {
                        setObj((old) => {
                          const newobj = { ...obj, title: e.target.value };
                          return newobj;
                        });
                      }}
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="update_news_1"
                    />
                  </div>
                  <div
                    className={`${
                      activeInput == "update_news_2" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[500] text-[16px]">
                      Mô Tả Ngắn
                    </h3>
                    <input
                      name="ShortDescription"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.shortDescription}
                      onChange={(e) => {
                        setObj((old) => {
                          const newobj = {
                            ...obj,
                            shortDescription: e.target.value,
                          };
                          return newobj;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="update_news_2"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={`${
                      activeInput == "update_news_3" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mb-[12px] font-[500] text-[16px]"
                      htmlFor="file_inputCreate"
                    >
                      Tải ảnh
                    </label>
                    <label
                      htmlFor="file_inputCreate"
                      className="w-[348px] flex items-center justify-center h-[40px] block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    >
                      <input
                        name="thumbnail"
                        accept="png,jpeg,jpg"
                        onFocus={(e) => {
                          setActiveInput(e.target.id);
                        }}
                        onChange={handleFileChange}
                        onBlur={(e) => {
                          setActiveInput(null);
                        }}
                        className="hidden "
                        id="file_inputCreate"
                        type="file"
                      />
                      {file?.name !== "Chọn ảnh" ? "1 Đã Chọn" : file.name}
                    </label>
                  </div>
                  <div
                    className={`${
                      activeInput == "update_news_4" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[9px] font-[500] text-[16px]">
                      Khoa truyền thông báo
                    </h3>

                    <Select
                      isMulti
                      defaultValue={{ label: "Tất cả", value: "" }}
                      onChange={(option) => {
                        setOptionSelected(option);
                      }}
                      options={options}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "update_news_5" && "active-input"
                    } rounded-[3px] w-[730px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[500] text-[16px]">
                      Nội Dung
                    </h3>
                    <Editor
                      editorState={editorState}
                      wrapperClassName="demo-wrapper"
                      editorClassName="demo-editor"
                      onEditorStateChange={(state) => {
                        setEditorState(state);
                      }}
                      // toolbar={{
                      //   image: {
                      //     uploadEnabled: true,
                      //     uploadCallback: uploadImageCallBack,
                      //   },
                      // }}
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="update_news_5"
                    ></label>
                  </div>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="flex justify-center items-center text-center">
                <button
                  onClick={handleSubmit}
                  className="btn-set-css min-w-[180px] my-[20px] rounded-[3px]  h-[50px] p-[10px] font-[900] text-[15px] border-[1px] border-[rgb(216, 65, 48)]"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateNews;
