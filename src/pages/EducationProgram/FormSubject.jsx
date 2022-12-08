import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EducationProgramAPI from "../../API/EducationProgramAPI";
import s from "./Form.module.css";
import updateFormImg from "../../assests/updateForm.png";
import "../scss/main.scss";
import SchoolYearAPI from "../../API/SchoolYearAPI";
import FacultyAPI from "../../API/FacultyAPI";
import Select from "react-select";
import SubjectAPI from "../../API/SubjectAPI";
import { validData } from "./FormEducationProgram";
const FormSubject = ({ setView, id, code, view, setNewData }) => {
  const [data, setData] = useState({
    id: null,
    code: "",
    name: "",
    numberOfCredits: null,
    mandatory: null,
    passMarks: null,
  });
  const [listShoolYear, setListSchoolYear] = useState([]);
  const [listFaculty, setListFaculty] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedFaculty, setSelectFaculty] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  useEffect(() => {
    if (view && code) {
      EducationProgramAPI.getSubject({ code }).then(({ data }) => {
        setData(data);
      });
    }
  }, [code]);
  useEffect(() => {
    SchoolYearAPI.getAll({ status: true }).then(({ data }) => {
      const modifiedData = data.map((y) => {
        if (y.code === data?.code) {
          setListSchoolYear({ value: y.code, label: y.name });
        }
        return { value: y.code, label: y.name };
      });
      setListSchoolYear(modifiedData);
    });
    FacultyAPI.getALLFaculty().then(({ data }) => {
      const modifiedData = data.map((f) => {
        if (f.code === data?.code) {
          setSelectFaculty({ value: f.code, label: f.name });
        }
        return { value: f.code, label: f.name };
      });
      setListFaculty(modifiedData);
    });
  }, []);
  const handleAdd = async (e) => {
    try {
      if (!validData(data)) {
        return;
      }
      const result = await SubjectAPI.create(data);
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
    const objRequest = {
      code: data.code,
      id: data.id,
      mandatory: data.mandatory,
      name: data.name,
      numberOfCredits: data.numberOfCredits,
      passMarks: data.passMarks,
    };
    if (!validData(objRequest)) {
      return;
    }
    try {
      const result = await EducationProgramAPI.update(objRequest);
      setNewData((d) => {
        return d.map((n) => {
          if (result.data.code === n.code) {
            return result.data;
          }
          return n;
        });
      });
      setView("");
      toast.success("Chỉnh sửa thành công");
    } catch (error) {
      toast.error("Chỉnh sửa khoa thất bại");
    }
  };
  const handleFile = async (e) => {
    const file = e.target.files;
    if (file.length) setFile(file[0]);
  };

  return (
    <form className={`confirm ${view && "show"}`}>
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
                onChange={(option) => setSelectedYear(option)}
                options={listShoolYear}
              />
            </div>
          </div>
          <div className={s.row}>
            <div className={s.field}>
              <label htmlFor="">File excel</label>
              <input type="file" name="" id="" onChange={handleFile} />
            </div>
          </div>
        </div>
        <div className="h-full flex mt-4 flex-col flex-1  justify-end">
          <div className="border-t-4 ">
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
  );
};

export default FormSubject;