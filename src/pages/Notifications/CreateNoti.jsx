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

const SGOptions = [
  { value: "0", label: "Tất Cả" },
  { value: "1", label: "Giáo Viên" },
  { value: "2", label: "Sinh Viên" },
];

const CreateNotification = ({
  createShow,
  setCreateShow,
  keyFresh,
  setKeyFresh,
}) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [activeInput, setActiveInput] = useState(null);
  const [file, setFile] = useState({ name: "Chọn ảnh" });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [facultyOptions, setFacultyOptions] = useState([]);
  const [notificationGroupCodeOptions, setNotificationGroupCodeOptions] =
    useState([]);
  const [classesCodeOptions, setClassesCodeOptions] = useState([]);

  const [facultyOptionSelected, setFacultyOptionSelected] = useState([
    { value: "", label: "Tất Cả" },
  ]);
  const [
    notifyCationGroupCodeOptionSelected,
    setNotifyCationGroupCodeOptionSelected,
  ] = useState([]);
  const [classesCodeOptionSelected, setClassesCodeOptionSelected] = useState([
    { value: "", label: "Tất Cả" },
  ]);
  const [typeSelected, setTypeSelected] = useState([
    { value: "0", label: "Tất Cả" },
  ]);

  const getNotificationGroupCode = async () => {
    const { data } = await axios.get(
      "http://18.140.66.234/api/v1/notification-groups/all?status=true"
    );
    let optionForNotifyCationGC = [];

    data.forEach((item) => {
      optionForNotifyCationGC.push({ value: item.code, label: item.name });
    });

    setNotificationGroupCodeOptions(optionForNotifyCationGC);
  };

  const getclassesCodeCode = async () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };
    const {
      data: { data },
    } = await axios.get(
      `http://18.140.66.234/api/v1/classes/page?page=1&size=10000`,
      config
    );
    let optionForClassesCode = [];
    optionForClassesCode.push({ value: "", label: "Tất Cả" });

    data.forEach((item) => {
      optionForClassesCode.push({ value: item.code, label: item.name });
    });

    setClassesCodeOptions(optionForClassesCode);
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
    setFacultyOptions(optionForFaculty);
  };

  useEffect(() => {
    getclassesCodeCode();
    getNotificationGroupCode();
    getFaculty();
  }, [keyFresh, createShow]);

  const handleClose = () => {
    setTitle("");
    setShortDescription("");
    setActiveInput(null);
    setCreateShow(!createShow);
  };

  const createUrlQuery = (arr, strUrl) => {
    let urlQuery = "";
    arr.map((item, i) => {
      if (item.value) {
        urlQuery += strUrl + "=" + item.value + "&";
      }
    });
    return urlQuery;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length === 0) {
      toast.error("Tiêu đề không được để trống!");
      return 0;
    }
    if (shortDescription.length === 0) {
      toast.error("Mô tả ngắn không được để trống!");
      return 0;
    }
    if (file.name === "Chọn ảnh") {
      toast.error("Vui lòng chọn ảnh!");
      return 0;
    }
    if (editorState.getCurrentContent().getPlainText().length === 0) {
      toast.error("Nội dung không được để trống!");
      return 0;
    }

    // if(!facultyOptionSelected || facultyOptionSelected?.length === 0) {
    //   toast.error("Chọn Khoa để gửi thông báo!")
    //   return 0;
    // }
    if (
      !notifyCationGroupCodeOptionSelected ||
      notifyCationGroupCodeOptionSelected?.length === 0
    ) {
      toast.error("Chọn nhóm để gửi thông báo!");
      return 0;
    }
    // if(!classesCodeOptionSelected || classesCodeOptionSelected?.length === 0) {
    //   toast.error("Chọn lớp để gửi thông báo!")
    //   return 0;
    // }

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

    const facultyUrl = createUrlQuery(facultyOptionSelected, "facultyCodes");
    const notifyGCUrl = createUrlQuery(
      notifyCationGroupCodeOptionSelected,
      "notificationGroupCode"
    );
    const classCodesUrl = createUrlQuery(
      classesCodeOptionSelected,
      "classCodes"
    );

    try {
      await axios.post(
        `http://18.140.66.234/api/v1/notifications?${facultyUrl}${notifyGCUrl}${classCodesUrl}type=${typeSelected.value}&` +
          new URLSearchParams({
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            shortDescription,
            title,
          }),
        bodyFormData,
        config
      );

      handleClose();
      setKeyFresh((old) => old + 1);
      toast.success("Thông báo vừa được tạo thành công!");
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
          <form  className="confirmed">
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
                  <h1 className="text-[20px] font-[600]">Tạo Thông Báo</h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_noties_1" && "active-input"
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
                      id="create_noties_1"
                    />
                  </div>
                  <div
                    className={`${
                      activeInput == "create_noties_2" && "active-input"
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
                      id="create_noties_2"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={`${
                      activeInput == "create_noties_3" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mb-[12px] font-[500] text-[16px]"
                      htmlFor="file_inputCreateNoti"
                    >
                      Tải ảnh
                    </label>
                    <label
                      htmlFor="file_inputCreateNoti"
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
                        id="file_inputCreateNoti"
                        type="file"
                      />
                      {file?.name !== "Chọn ảnh" ? "1 Đã Chọn" : file.name}
                    </label>
                  </div>
                  <div
                    className={`${
                      activeInput == "create_noties_4" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[9px] font-[500] text-[16px]">
                      Khoa truyền thông báo
                    </h3>

                    <Select
                      isMulti
                      defaultValue={facultyOptionSelected}
                      onChange={(option) => {
                        setFacultyOptionSelected(option);
                      }}
                      options={facultyOptions}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "349px", 
                          minWidth:"349px", 
                          maxWidth:"349px"
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={`${
                      activeInput == "create_noties_5" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[9px] font-[500] text-[16px]">
                      Mã nhóm truyền thông báo
                    </h3>
                    <Select
                      isMulti
                      defaultValue={notifyCationGroupCodeOptionSelected}
                      onChange={(option) => {
                        setNotifyCationGroupCodeOptionSelected(option);
                      }}
                      options={notificationGroupCodeOptions}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "349px", 
                          minWidth:"349px", 
                          maxWidth:"349px"
                        }),
                      }}
                    />
                  </div>
                  <div
                    className={`${
                      activeInput == "create_noties_6" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[9px] font-[500] text-[16px]">
                      Lớp truyền thông báo
                    </h3>

                    <Select
                      isMulti
                      defaultValue={classesCodeOptionSelected}
                      onChange={(option) => {
                        setClassesCodeOptionSelected(option);
                      }}
                      options={classesCodeOptions}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "349px", 
                          minWidth:"349px", 
                          maxWidth:"349px"
                        }),
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <div
                    className={`${
                      activeInput == "create_noties_5" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[9px] font-[500] text-[16px]">
                      Đối tượng truyền thông báo
                    </h3>
                    <Select
                      defaultValue={typeSelected}
                      onChange={(option) => {
                        setTypeSelected(option);
                      }}
                      options={SGOptions}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "349px", 
                          minWidth:"349px", 
                          maxWidth:"349px"
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_noties_7" && "active-input"
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
                      htmlFor="create_noties_7"
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

export default CreateNotification;
