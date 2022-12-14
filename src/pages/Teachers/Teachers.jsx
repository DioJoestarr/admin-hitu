import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DataTable from "react-data-table-component";
import "../scss/main.scss";
import {getListTeacherPerPage} from '../../redux/toolskit/userSlice'
import UpdateCustomer from './UpdateTeacher';
import ConfirmDelete from '../Services/ConfirmDelete';
import CreateCustomer from './CreateTeacher';
import { toast } from "react-toastify";
import import_excel_svg from "../../assests/import_excel_svg.png"
import axios from 'axios';
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactLoading from "react-loading";

const Teachers = () => {
  const dispatch = useDispatch();

  const {data: users} = useSelector(state => state.userState)
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const [keyFresh, setKeyFresh] = useState(0)

  const [updateShow, setUpdateShow] = useState(false)
  const [createShow, setCreateShow] = useState(false)

  const [deleteShow, setDeleteShow] = useState(false)

  const [userId, setUserId] = useState(null)
  const [rowId, setRowId] = useState(null)


  const getData = async () => {
        setLoading(true);
        await dispatch(getListTeacherPerPage({page: 1, size: 10}));
        setTimeout(() => {
          setLoading(false);
        }, 375)
      }

  useEffect(() => {
    getData();
  }, [keyFresh]);

  const handleCreate =async () => {
    if(!file) {
      setCreateShow(true)
    } else {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${JSON.parse(
            localStorage.getItem("accessToken")
          )}`,
        },
      };
  
      var bodyFormData = new FormData();
      bodyFormData.append("file", file);
      try {
        await axios.post(`http://18.140.66.234/api/v1/teachers/upload-excel`,
          bodyFormData,
          config
        );

        setKeyFresh((old) => old + 1);
        setFile({})
        toast.success("Gi??o vi??n ???????c th??m th??nh c??ng!");
      } catch (err) {
        setFile({})
        toast.error(err.response.data.message);
      }
    }

  }

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://18.140.66.234/api/v1/teachers/toggle-status?ids=${id}`, {method: "PUT"})
      setKeyFresh(old => old + 1)
      toast.success("Ng?????i d??ng v???a ???????c x??a th??nh c??ng");
    } catch (error) {
      toast.error("Ng?????i d??ng ch??a ???????c x??a!");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  

  const columns = [
    {
      name: "T??n",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      sortable: true,
      name: "S??? ??i???n tho???i",
      selector: (row) => row.phone,
    },
    {
      sortable: true,
      name: "?????a ch???",
      selector: (row) => row.address,
    },
    {
      sortable: true,
      name: "Khoa",
      selector: (row) => row.facultyName,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Tham gia l??c",
      selector: (row) => row.createdDate.toString().slice(0,10),
      sortable: true,
    },
    {
      name: "Ch???c n??ng",
      selector: (row) => (
        <div className="action--item">
          <button
            className="btn-action update-handle"
            onClick={() => {
              // history(`/dashboard/update/user/${row.id}`);
              setUpdateShow(true)
              setUserId(row.userId)
            }}
          >
            S???a
          </button>
          <button
            className="btn-action delete-handle"
            onClick={() => {
              setRowId(row.id)
              setDeleteShow(true)
              // handleDeleteUser(row);
            }}
          >
            X??a
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="col l-10 m-[30px_50px]">
      { !loading &&
        // <DataTableExtensions {...tableData} >
        <DataTable
          title="Danh s??ch gi??o vi??n"
          columns={columns}
          data={users}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="400px"
          // selectableRows
          selectableRowsHighlight={false}
          // onSelectedRowsChange={handleSelectedChange}
          actions={
            <div className='flex justify-center items-center'>
              <span className='text-black font-[600] text-[12px] mr-[12px]'>{file ? file.name: ""}</span>
              <label htmlFor="file_excel" className='cursor-pointer btn flex items-center justify-start  outline-none p-[10px] w-[45px] h-[40px] bg-[#fff] border-[1px] border-black rounded-[5px] text-white mr-[15px]'>
                <img className='w-[25px] ' src={import_excel_svg} alt="" />
                <input onChange={handleFileChange} className='hidden' id='file_excel' type="file" accept=".xlsx,.xls,.csv" />
              </label>
              <button className="btn flex items-center justify-center  outline-none p-[10px] w-[90px] h-[40px] bg-[#29d21a] rounded-[5px] text-white mr-[15px]" onClick={handleCreate}>
                T???o
              </button>
            </div>
          }
          dense
        />
        // </DataTableExtensions>
      }
      <UpdateCustomer updateShow={updateShow} setUpdateShow={setUpdateShow} userId={userId} setUserId={setUserId} keyFresh={keyFresh} setKeyFresh={setKeyFresh}/>
      <CreateCustomer createShow={createShow} setCreateShow={setCreateShow} keyFresh={keyFresh} setKeyFresh={setKeyFresh}/>
      <ConfirmDelete onClick={() => {handleDeleteUser(rowId)}} deleteShow={deleteShow} setDeleteShow={setDeleteShow} />
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


export default Teachers;
