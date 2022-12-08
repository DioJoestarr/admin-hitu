import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useLocation, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import EducationProgramAPI from "../../API/EducationProgramAPI";
import SubjectAPI from "../../API/SubjectAPI";
import FormSubject from "./FormSubject";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactLoading from "react-loading";
const EducationProgramSubject = () => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [code, setCode] = useState(null);
  const [view, setView] = useState("");
  let { id } = useParams();
  useEffect(() => {
    setLoading(true);

    EducationProgramAPI.getSubject({ code: id })
      .then(({ data }) => {
        setTimeout(() => {
          setLoading(false);
        }, 375)
        setData(data);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, []);
  const handleDelete = async (ids) => {
    try {
      await SubjectAPI.hidden(ids);
      toast.success("Xoá thành công");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const columns = [
    {
      name: "Mã môn học",
      selector: (row) => row.subjectCode,
      sortable: true,
      width: "140px",
    },
    {
      name: "Tên môn học",
      selector: (row) => row.subjectName,
      sortable: true,
      width: "280px",
    },
    {
      name: "Số tín chỉ",
      selector: (row) => row.numberOfCredits,
      sortable: true,
      width: "140px",
    },
    {
      name: "Học kỳ",
      selector: (row) => row.semester,
      sortable: true,
      width: "140px",
    },
    {
      name: "Bắt buộc",
      selector: (row) => (row.mandatory === true ? "Có" : "Không"),
      sortable: true,
      width: "140px",
    },
    // {
    //   name: "Chức Năng",
    //   selector: (row) => (
    //     <div className="action--item flex items-center justify-center relative">
    //       <button
    //         className="btn-action update-handle hover:scale-110 !bg-green-700 !font-medium !text-white"
    //         onClick={() => {
    //           setRowId(row.id);
    //           setCode(row.code);
    //           setView("UPDATE");
    //         }}
    //       >
    //         Sửa
    //       </button>
    //       <button
    //         className="btn-action delete-handle !font-medium hover:scale-110 !text-white !text-md"
    //         onClick={() => {
    //           handleDelete(row.id);
    //         }}
    //       >
    //         Xóa
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className="rounded-lg shadow-md col l-10 m-[30px_50px] font-sans">
      {!loading && <DataTable
        title={data?.code + "  " + data?.name}
        columns={columns}
        data={data?.educationProgramSubjectDtos}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="400px"
        actions={
          <div className=" space-x-3 flex items-center">
            <div className="!text-base">
              Tổng số tín chỉ: {data?.totalCredits}
            </div>
          </div>
        }
        dense
      />}
      {view && (
        <FormSubject
          code={code}
          id={rowId}
          setView={setView}
          view={view}
          setNewData={setData}
        />
      )}
      <Modal
        showCloseIcon={false}
        open={loading}
        onClose={() => {}}
        center={true}
        classNames={{
          overlay: "customOverlayLoading",
          modal: "customModalLoading",
        }}
      >
        <div className="flex justify-center items-center" style={{ width: "200px", height: "200px" }}>
          <ReactLoading
            type={"spinningBubbles"}
            color={"black"}
            height={"40%"}
            width={"40%"}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EducationProgramSubject;