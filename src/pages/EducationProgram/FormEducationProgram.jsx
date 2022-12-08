import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EducationProgramAPI from "../../API/EducationProgramAPI";
import s from "./Form.module.css";
import updateFormImg from "../../assests/updateForm.png";
import "../scss/main.scss";
import SchoolYearAPI from "../../API/SchoolYearAPI";
import FacultyAPI from "../../API/FacultyAPI";
import Select from "react-select";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
export const validData = (data) => {
  let isValid = true;
  Object.keys(data).forEach((k) => {
    if (!data[k]) {
      isValid = false;
      toast.error("Vui lòng nhập đầy đủ thông tin");
    }
  });
  return isValid;
};
const FormEducationProgram = ({ setView, id, code, view, setNewData }) => {
  const [data, setData] = useState({
    id: null,
    code: "",
    name: "",
  });
  const [listShoolYear, setListSchoolYear] = useState([]);
  const [listFaculty, setListFaculty] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFaculty, setSelectFaculty] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (view && code) {
      EducationProgramAPI.getOne({ code }).then(({ data }) => {
        setData(data);
      });
    }
  }, [code]);
  useEffect(() => {
    SchoolYearAPI.getAll({ status: true }).then((response) => {
      const modifiedData = response.data.map((y) => {
        return { value: y.code, label: y.name };
      });
      setListSchoolYear(modifiedData);
    });
    FacultyAPI.getALLFaculty().then((response) => {
      const modifiedData = response.data.map((f) => {
        return { value: f.code, label: f.name };
      });
      setListFaculty(modifiedData);
    });
  }, []);
  const handleAdd = async (e) => {
    try {
      const formData = new FormData();

      const objRequest = {
        code: data.code,
        name: data.name,
        facultyCode: selectedFaculty.value,
        schoolYearCode: selectedYear.value,
      };
      if (!validData(objRequest)) {
        return;
      }
      formData.append("file", file);
      const result = await EducationProgramAPI.create(objRequest, formData);
      setNewData((d) => {
        return [...d, result.data];
      });
      setView("");
      toast.success("Thêm thành công");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (e) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const objRequest = {
        code: data.code,
        name: data.name,
        id: data.id,
      };
      if (!validData(objRequest)) {
        return;
      }
      const result = await EducationProgramAPI.update(objRequest, formData);
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
      toast.error(error.response.data.message);
    }
  };
  const handleFile = async (e) => {
    const file = e.target.files;
    if (file.length) setFile(file[0]);
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
        <form className={`confirmed `}>
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
                  {view === "UPDATE"
                    ? "Chỉnh sửa chương trình học"
                    : "Thêm mới chương trình"}
                </h1>
              </div>
            </div>
            <div className={s.main}>
              <div className={s.row}>
                <div className={s.field}>
                  <label htmlFor="" className="py-2 text-start">
                    Mã chương trình
                  </label>
                  <input
                    type="text"
                    onChange={(e) => {
                      setData({ ...data, code: e.target.value });
                    }}
                    value={data.code}
                  />
                </div>
                <div className={s.field}>
                  <label htmlFor="">Tên chương trình học</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => {
                      setData({ ...data, name: e.target.value });
                    }}
                  />
                </div>
              </div>
              {view !== "UPDATE" && (
                <div className={s.row}>
                  <div className={s.field}>
                    <label htmlFor="">Khoa</label>
                    <Select
                      className={s.select}
                      onChange={(option) => {
                        setSelectFaculty(option);
                      }}
                      options={listFaculty}
                    />
                  </div>
                  <div className={s.field}>
                    <label htmlFor="">Năm học</label>
                    <Select
                      className={s.select}
                      defaultValue={selectedYear?.value}
                      onChange={(option) => setSelectedYear(option)}
                      options={listShoolYear}
                    />
                  </div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.field}>
                  <label htmlFor="">File excel các môn học</label>
                  <input type="file" name="" id="" onChange={handleFile} />
                </div>
              </div>
            </div>
            <div className="h-full flex mt-4 flex-col flex-1  justify-end">
              <div className="border-t-4 flex justify-center items-center text-center">
                <button
                  type="button"
                  onClick={view === "UPDATE" ? handleUpdate : handleAdd}
                  className={s.btnSubmit}
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

export default FormEducationProgram;
