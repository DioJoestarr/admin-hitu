import React, { useRef, useEffect, useState } from "react";
import TeacherAPI from "../../API/TeacherAPI";
import "../scss/main.scss";
import updateFormImg from "../../assests/updateForm.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const UpdateTeacher = ({
  updateShow,
  setUpdateShow,
  userId,
  setUserId,
  keyFresh,
  setKeyFresh,
}) => {

  const [activeInput, setActiveInput] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [facultySelected, setFacultySelected] = useState("");

  const [obj, setObj] = useState({
    address: "",
    dob: "",
    email: "",
    facultyCode: "",
    gender: "",
    id: "",
    manager: "",
    name: "",
    password: "",
    phone: "",
    remark: "",
    roleCodes: [],
    userId: "",
  });

  const getFaculty = async () => {
    const { data } = await axios.get(
      "http://18.140.66.234/api/v1/faculties/all?status=true"
    );
    setFaculty(data);
  };

  const getTeacherData = async (userId) => {
    const {
      data: {
        address,
        dob,
        email,
        facultyCode,
        gender,
        id,
        manager,
        name,
        password,
        phone,
        remark,
        roleCodes,
      },
    } = await TeacherAPI.getSingleTeacher(userId);
    setObj({
      ...obj,
      address,
      dob,
      email,
      facultyCode,
      gender,
      id,
      manager,
      name,
      phone,
      remark,
      roleCodes,
      userId,
    });
    const {data} = await axios.get(`http://18.140.66.234/api/v1/faculties?code=${facultyCode}`)
    setFacultySelected(data.code)
  };

  useEffect(() => {
    if (userId) {
      getTeacherData(userId);
      getFaculty();
    }
  }, [userId, keyFresh, updateShow]);


  const handleClose = () => {
    setActiveInput(null);
    setUserId(null);
    setUpdateShow(!updateShow);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (obj.name.length <= 3) {
      toast.error("T??n gi??o vi??n kh??ng ???????c b?? h??n 4 k?? t???!");
      return 0;
    }
    if (!obj.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      toast.error("Vui l??ng nh???p s??? ??i???n tho???i h???p l???!");
      return 0;
    }
    if (
      !obj.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      toast.error("Vui l??ng nh???p Email h???p l???!");
      return 0;
    }
    if (obj.password?.length <= 7 && obj.password?.length >= 1) {
      toast.error("M???t kh???u kh??ng ???????c b?? h??n 8 k?? t???!");
      return 0;
    }
    if (obj.address === "") {
      toast.error("?????a ch??? kh??ng ???????c ????? tr???ng!");
      return 0;
    }
    if (facultySelected === "") {
      toast.error("Vui l??ng ch???n khoa!");
      return 0;
    }
    try {
      let res = await fetch("http://18.140.66.234/api/v1/teachers", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          address: obj.address,
          dob: obj.dob,
          email: obj.email,
          facultyCode: facultySelected,
          gender: obj.gender,
          id: obj.id,
          manager: obj.manager,
          name: obj.name,
          password: obj.password,
          phone: obj.phone,
          remark: obj.remark,
          roleCodes: obj.roleCodes,
          userId: obj.userId,
        }),
      });
      setObj("");
      toast.success("C???p nh???t Gi??o Vi??n th??nh c??ng!");
      setKeyFresh((old) => old + 1);
    } catch (err) {
      toast.success("C???p nh???t Gi??o Vi??n kh??ng th??nh c??ng!");
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
          <form className="confirmed show">
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
                    Ch???nh S???a Th??ng Tin Gi??o Vi??n
                  </h1>
                </div>
              </div>
              <div className="border-b-[1px] border-black"></div>
              <div className="mb-[20px] flex flex-col justify-center mx-[20px]">
                {/*name + password */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "first_1" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">H??? T??n</h3>
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
                      id="first_1"
                    />
                    <label className="font-[400] text-[11px]" htmlFor="first_1">
                      VD: Nguyen Van A
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "first_2" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      S??? ??i???n Tho???i
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
                      id="first_2"
                    />
                    <label className="font-[400] text-[11px]" htmlFor="first_2">
                      VD: 0389960079
                    </label>
                  </div>
                </div>
                {/*email + role */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "first_3" && "active-input"
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
                      id="first_3"
                    />
                    <label className="font-[400] text-[11px]" htmlFor="first_3">
                      VD: example@example.com
                    </label>
                  </div>

                  <div
                    className={`${
                      activeInput == "first_4" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">Khoa</h3>
                    <select
                      onFocus={(e) => {
                        setActiveInput(e.target.id);
                      }}
                      onChange={(e) => {
                        setFacultySelected(e.target.value);
                      }}
                      className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                      name=""
                    >
                      {faculty.map((item, i) => (
                        <option selected={item.code === facultySelected  ? true : false} key={i} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    {/* <input
                  onFocus={(e) => {
                    setActiveInput(e.target.id);
                  }}
                  value=""
                  onBlur={e => { setActiveInput(null);  }}
                  onChange = {e =>{ setObj(...obj, {role: e.target.value})}}
                  className="mb-[12px] px-[12px] w-[348px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                  type="text"
                  id="first_4"
                /> */}
                    <label className="font-[400] text-[11px]" htmlFor="first_4">
                      Ch???n Khoa
                    </label>
                  </div>
                </div>
                {/*pass + address */}
                <div className="flex justify-center items-center">
                  <div
                    className={` ${
                      activeInput == "first_6" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      M???t Kh???u
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
                      id="first_6"
                    />
                    <label className="font-[400] text-[11px]" htmlFor="first_6">
                      M???c ?????nh l?? m???t kh???u c??
                    </label>
                  </div>
                  <div
                    className={` ${
                      activeInput == "first_5" && "active-input"
                    } rounded-[3px] w-[369px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
                  >
                    <h3 className="mb-[12px] font-[600] text-[16px]">
                      ?????a ch???
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
                      id="first_5"
                    />
                    <label className="font-[400] text-[11px]" htmlFor="first_5">
                      VD: Th??nh ph??? H??? Ch?? Minh
                    </label>
                  </div>
                </div>
                {/* input 100% length */}
                {/* <div className="flex justify-center items-center">
              <div
                className={` ${
                  activeInput == "first_5" && "active-input"
                } rounded-[3px] w-[738px] px-[10px] py-[12px] mt-[28px] flex flex-col justify-center items-start`}
              >
                <h3 className="mb-[12px] font-[600] text-[16px]">?????a ch???</h3>
                <input
                name="address"
                  onFocus={(e) => {
                    setActiveInput(e.target.id);
                  }}
                  value={obj.address}
                  onChange={(e) => {
                    setObj((old) => {
                      const newObject = {...old, address: e.target.value}
                      return newObject
                    })
                  }}
                  onBlur={e => { setActiveInput(null);  }}
                  className="mb-[12px] px-[12px] w-[716px] h-[40px] input-hover font-[14px] rounded-[4px] border-[1px] border-solid border-[rgba(0,0,0,0.4)]"
                  type="text"
                  id="first_5"
                />
                <label className="font-[400] text-[11px]" htmlFor="first_5">
                  Th??nh ph??? H??? Ch?? Minh
                </label>
              </div>
            </div>      */}
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

export default UpdateTeacher;
