import React, { useRef, useEffect, useState } from "react";
import "../scss/main.scss";
import updateFormImg from "../../assests/updateForm.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const UpdateStudent = ({
  updateShow,
  setUpdateShow,
  userId,
  setUserId,
  keyFresh,
  setKeyFresh,
}) => {
  const [classCode, setClassCode] = useState([]);
  const [classCodeSelected, setClassCodeSelected] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const [obj, setObj] = useState({
    address: "",
    dob: "",
    email: "",
    gender: "",
    name: "",
    password: "",
    phone: "",
    remark: "",
    userId: "",
  });

  const getTeacherData = async (userId) => {
    const {
      data: { address, dob, email, classCode, gender, id, name, phone, remark },
    } = await axios.get(
      `http://18.140.66.234/api/v1/students?userId=${userId}`
    );
    setObj({
      ...obj,
      address,
      dob,
      email,
      classCode,
      gender,
      id,
      name,
      phone,
      remark,
      userId,
    });
    const config = {
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };
    const {data} = await axios.get(`http://18.140.66.234/api/v1/classes?code=${classCode}`, config)
    setClassCodeSelected(data.code)
  };

  const getClassCode = async () => {
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
      "http://18.140.66.234/api/v1/classes/page?page=1&size=10",
      config
    );
    setClassCode(data);
  };

  useEffect(() => {
    if (userId) {
      getTeacherData(userId);
      getClassCode();
    }
  }, [userId, keyFresh, updateShow]);

  useEffect(() => {}, [updateShow]);

  const handleClose = () => {
    setActiveInput(null);
    setUserId(null);
    setUpdateShow(!updateShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (obj.name.length <= 3) {
      toast.error("Tên sinh viên không được bé hơn 4 kí tự!");
      return 0;
    }
    if (!obj.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ!");
      return 0;
    }
    if (
      !obj.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Vui lòng nhập Email hợp lệ!");
      return 0;
    }
    if (classCodeSelected === "") {
      toast.error("Vui lòng chọn Lớp!");
      return 0;
    }
    if (obj.password?.length <= 7 && obj.password?.length >= 1) {
      toast.error("Mật khẩu không được bé hơn 8 kí tự!");
      return 0;
    }
    if (obj.address === "") {
      toast.error("Địa chỉ không được để trống!");
      return 0;
    }

    var date = new Date();
    var current_date =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());

    try {
      await fetch("http://18.140.66.234/api/v1/students", {
        headers: {
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          address: obj.address,
          dob: current_date,
          email: obj.email,
          classCode: classCodeSelected,
          gender: obj.gender,
          id: obj.id,
          name: obj.name,
          password: obj.password,
          phone: obj.phone,
          remark: "",
          userId: obj.userId,
        }),
      });

      setObj("");
      toast.success("Cập nhật Sinh Viên thành công!");
      setKeyFresh((old) => old + 1);
    } catch (err) {
      toast.error(err);
      console.log(err);
    }

    handleClose();
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
                  <h1 className="text-[20px] font-[600]">
                    Chỉnh Sửa Thông Tin Sinh Viên
                  </h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                {/*name + password */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_1" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Họ Tên</h3>
                    <input
                      name="name"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.name}
                      onChange={(e) => {
                        setObj((old) => {
                          const newObject = { ...old, name: e.target.value };
                          return newObject;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_1"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_1"
                    >
                      VD: Nguyen Van A
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "create_2" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      Số Điện Thoại
                    </h3>
                    <input
                      name="phone"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.phone}
                      onChange={(e) => {
                        setObj((old) => {
                          const newObject = { ...old, phone: e.target.value };
                          return newObject;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_2"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_2"
                    >
                      VD: 0389960079
                    </label>
                  </div>
                </div>
                {/*email + role */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_3" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Email</h3>
                    <input
                      name="email"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.email}
                      onChange={(e) => {
                        setObj((old) => {
                          const newObject = { ...old, email: e.target.value };
                          return newObject;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="email"
                      id="create_3"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_3"
                    >
                      VD: example@example.com
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "create_4" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Lớp</h3>
                    <select
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      onChange={(e) => {
                        setClassCodeSelected(e.target.value);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      name=""
                    >
                      {classCode?.map((item, i) => (
                        <option selected={item.code === classCodeSelected  ? true : false} key={i} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_4"
                    >
                      Vui lòng chọn lớp
                    </label>
                  </div>
                </div>
                {/*pass + address */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_6" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      Mật Khẩu
                    </h3>
                    <input
                      name="password"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.password}
                      onChange={(e) => {
                        setObj((old) => {
                          const newObject = {
                            ...old,
                            password: e.target.value,
                          };
                          return newObject;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="password"
                      id="create_6"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_6"
                    >
                      Mặc định là mật khẩu cũ
                    </label>
                  </div>
                  <div
                    className={` ${
                      activeInput == "create_5" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      Địa chỉ
                    </h3>
                    <input
                      name="address"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={obj.address}
                      onChange={(e) => {
                        setObj((old) => {
                          const newObject = { ...old, address: e.target.value };
                          return newObject;
                        });
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_5"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_5"
                    >
                      VD: Thành phố Hồ Chí Minh
                    </label>
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

export default UpdateStudent;
