import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FacultyAPI from "../../API/FacultyAPI";
import updateFormImg from "../../assests/updateForm.png";
import "../scss/main.scss";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import s from "./../EducationProgram/Table.module.css"
const FormFaculty = ({ setView, id, code, view, setNewData }) => {
  const [data, setData] = useState({
    id: null,
    code: "",
    name: "",
  });
  useEffect(() => {
    if (view && code) {
      FacultyAPI.getOneFaculty({ code }).then(({ data }) => {
        setData(data);
      });
    }
  }, [code]);

  const handleAdd = async (e) => {
    if (!data.code) {
      return toast.error("Vui lòng nhập mã khoa");
    }
    if (!data.name) {
      return toast.error("Vui lòng nhập tên khoa");
    }
    try {
      const result = await FacultyAPI.createFaculty({
        code: data.code,
        name: data.name,
      });
      setNewData((d) => {
        return [...d, result.data];
      });
      setView("");
      toast.success("Thêm thành công");
    } catch (error) {
      toast.error("Thêm khoa thất bại");
    }
  };
  const handleUpdate = async (e) => {
    if (!data.code) {
      return toast.error("Vui lòng nhập mã khoa");
    }
    if (!data.name) {
      return toast.error("Vui lòng nhập tên khoa");
    }
    try {
      const result = await FacultyAPI.updateFaculty({
        code: data.code,
        name: data.name,
        id: data.id,
      });
      setNewData((d) => {
        return d.map((khoa) => {
          if (result.data.code === khoa.code) {
            return result.data;
          }
          return khoa;
        });
      });
      setView("");
      toast.success("Chỉnh sửa thành công");
    } catch (error) {
      toast.error("Chỉnh sửa khoa thất bại");
    }
  };
  return (
    <>
      <Modal
        showCloseIcon={false}
        open={view}
        onClose={() => {
          setView(false);
        }}
        center={true}
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <form className={`confirmed`}>
          <div className="p-[20px] min-h-[645px]">
            <div
              className="closed"
              onClick={() => {
                setView("");
              }}
            >
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
                  {view === "UPDATE" ? "Chỉnh sửa khoa" : "Thêm mới khoa"}
                </h1>
              </div>
            </div>
            <div className="border-b-[1px] border-black"></div>

            <div className="flex min-h-[300px] justify-center w-full">
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <label htmlFor="" className="py-2 text-start">
                    Mã khoa
                  </label>
                  <input
                    type="text"
                    className=" border-2 p-2 rounded-lg border-gray-400"
                    onChange={(e) => {
                      setData({ ...data, code: e.target.value });
                    }}
                    value={data.code}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="" className="py-2 text-start">
                    Tên khoa
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    className=" border-2 p-2 rounded-lg border-gray-400"
                    onChange={(e) => {
                      setData({ ...data, name: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="h-full flex mt-4 flex-col flex-1  justify-end">
              <div className="border-t-4 flex justify-center items-center">
                <button
                  type="button"
                  onClick={view === "UPDATE" ? handleUpdate : handleAdd}
                  className="btn-set-css min-w-[180px] my-[20px] rounded-[3px]  h-[50px] p-[10px] font-[900] text-[15px] border-[1px] border-[rgb(216, 65, 48)]"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default FormFaculty;
