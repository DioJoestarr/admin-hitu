import React, { useRef, useEffect, useState } from "react";
import "../scss/main.scss";
import updateFormImg from "../../assests/updateForm.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uuid from "react-uuid";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const CreateStudent = ({
  createShow,
  setCreateShow,
  keyFresh,
  setKeyFresh,
}) => {
  const [classCode, setClassCode] = useState([]);
  const [activeInput, setActiveInput] = useState(null);
  const [classCodeSelected, setClassCodeSelected] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

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
    getClassCode();
  }, [createShow]);

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassword("");

    setActiveInput(null);
    setCreateShow(!createShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var date = new Date();
    var current_date =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "-" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("accessToken")
        )}`,
      },
    };
    if (name.length <= 3) {
      toast.error("Tên sinh viên không được bé hơn 4 kí tự!");
      return 0;
    }
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ!");
      return 0;
    }
    if (
      !email.match(
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
    if (password.length <= 7) {
      toast.error("Mật khẩu không được bé hơn 8 kí tự!");
      return 0;
    }
    if (address === "") {
      toast.error("Địa chỉ không được để trống!");
      return 0;
    }

    try {
      await axios.post(
        "http://18.140.66.234/api/v1/students",
        {
          address: address,
          classCode: classCodeSelected,
          dob: current_date,
          email: email,
          gender: true,
          name: name,
          password: password,
          phone: phone,
          userId: "SV" + uuid().slice(0, 16),
        },
        config
      );

      toast.success("Thêm sinh viên thành công!");
      setKeyFresh((old) => old + 1);
    } catch (err) {
      console.log(err);
    }

    handleClose();
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
                  <h1 className="text-[20px] font-[600]">Thêm Sinh Viên</h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                {/*name + password */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_students_1" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Họ Tên</h3>
                    <input
                      name="name"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_students_1"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_1"
                    >
                      VD: Nguyen Van A
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "create_students_2" && "active-input"
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
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_students_2"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_2"
                    >
                      VD: 0389960079
                    </label>
                  </div>
                </div>
                {/*email + role */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_students_3" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Email</h3>
                    <input
                      name="email"
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="email"
                      id="create_students_3"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_3"
                    >
                      VD: example@example.com
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "create_students_4" && "active-input"
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
                      <option value="">Chọn lớp</option>
                      {classCode?.map((item, i) => (
                        <option key={i} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_4"
                    >
                      Vui lòng chọn lớp
                    </label>
                  </div>
                </div>
                {/*pass + address */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "create_students_5" && "active-input"
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
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="password"
                      id="create_students_5"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_5"
                    >
                      VD: 12345678
                    </label>
                  </div>
                  <div
                    className={` ${
                      activeInput == "create_students_6" && "active-input"
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
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      onBlur={(e) => {
                        setActiveInput(null);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      type="text"
                      id="create_students_6"
                    />
                    <label
                      className="font-[400] text-[11px]"
                      htmlFor="create_students_6"
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

export default CreateStudent;
