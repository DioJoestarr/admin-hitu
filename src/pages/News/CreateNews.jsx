import React, { useRef, useEffect, useState } from "react";
import "../scss/main.scss";
import updateFormImg from "../../assests/updateForm.png";
import { toast } from "react-toastify";
import axios from "axios";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Select from "react-select";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const CreateNews = ({ createShow, setCreateShow, keyFresh, setKeyFresh }) => {
  const [file, setFile] = useState({ name: "Chọn ảnh" });
  const [activeInput, setActiveInput] = useState(null);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [options, setOptions] = useState([]);
  const [optionSelected, setOptionSelected] = useState([]);

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
    getFaculty();
  }, [createShow]);

  const handleClose = () => {
    setTitle("");
    setShortDescription("");
    setFile({ name: "Chọn ảnh" });
    setEditorState(() => EditorState.createEmpty());

    setActiveInput(null);
    setCreateShow(!createShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      toast.error("Tiêu đề không được để trống!");
      return 0;
    }
    if (title.length >= 150) {
      toast.error("Tiêu đề không được lớn hơn 150 kí tự!");
      return 0;
    }
    if (shortDescription === "") {
      toast.error("Mô tả ngắn không được để trống!");
      return 0;
    }
    if (file.name === "Chọn ảnh") {
      toast.error("Vui lòng chọn ảnh!");
      return 0;
    }
    if (shortDescription.length >= 255) {
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
      await axios.post(
        `http://18.140.66.234/api/v1/news?${facultyUrl}` +
          new URLSearchParams({
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            shortDescription: shortDescription,
            title: title,
          }),
        bodyFormData,
        config
      );

      setKeyFresh((old) => old + 1);
      handleClose();
      toast.success("Tin Tức Vừa Được Tạo Thành Công!");
    } catch (err) {
      toast.error(err.response.data.message);
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
        open={createShow}
        onClose={() => {
          setCreateShow(false);
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
                  <h1 className="text-[20px] font-[600]">Tạo Tin tức</h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_news_1" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[500] text-[16px]">
                      Tiêu Đề
                    </h3>
                    <input
                      name="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_news_1"
                    />
                  </div>
                  <div
                    className={`${
                      activeInput == "create_news_2" && "active-input"
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
                      value={shortDescription}
                      onChange={(e) => {
                        setShortDescription(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_news_2"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={`${
                      activeInput == "create_news_3" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mb-[12px] font-[500] text-[16px]"
                      htmlFor="file_inputCreateNew"
                    >
                      Tải ảnh
                    </label>
                    <label
                      htmlFor="file_inputCreateNew"
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
                        id="file_inputCreateNew"
                        type="file"
                      />
                      {file?.name !== "Chọn ảnh" ? "1 Đã Chọn" : file.name}
                    </label>
                  </div>
                  <div
                    className={`${
                      activeInput == "create_news_4" && "active-input"
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
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "349px", 
                          minWidth:"349px", 
                          maxWidth:"349px"
                        }),
                        menu: (baseStyles, state) => ({
                          ...baseStyles,
                          zIndex:10000
                        })
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_news_5" && "active-input"
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
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_news_5"
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

export default CreateNews;