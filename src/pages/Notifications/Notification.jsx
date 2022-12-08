import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import axios from 'axios';

import { getListNotification } from '../../redux/toolskit/notificationSlice.js'
import UpdateNotification from './UpdateNotification';
import CreateNotification from './CreateNoti';
import Details from '../Services/Details';
import ConfirmDelete from '../Services/ConfirmDelete';
import pencil from "../../assests/pencil.svg";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactLoading from "react-loading";


const Notification = () =>{
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [keyFresh, setKeyFresh] = useState(0);
  const [countSelected, setCountSelected] = useState(0);
  const [arrayId, setArrayId] = useState([]);
  const [rowId, setRowId] = useState(null)


  const [updateShow, setUpdateShow] = useState(false)
  const [createShow, setCreateShow] = useState(false)
  const [deleteShow, setDeleteShow] = useState(false)
  const [detailShow, setDetailShow] = useState(false)

  const [notificationId, setNotificationId] = useState(null)
  const getData = async () => {
    setLoading(true);
    const data = await dispatch(getListNotification({page:1, size:10}));
    setTimeout(() => {
      setLoading(false);
    }, 375)
    setNotification(data.payload);
}

const handleDeleteNotification = async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${JSON.parse(localStorage.getItem("accessToken"))}`
    },
  };
  try {
    await axios.put(`http://18.140.66.234/api/v1/notifications/toggle-status?ids=${id}`, undefined, config)
    setKeyFresh((oldv) => oldv + 1);
    toast.success("Tin tức vừa được xóa thành công");
    setCountSelected(0);
  } catch (error) {
    console.log(error)
    toast.error("Tin tức chưa được xóa!");
  }
};

const htmlToDraftBlocks = (html) => {
  const blocksFromHTML = convertFromHTML(html);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );
  const editor = EditorState.createWithContent(
    state
  )

  return editor.getCurrentContent().getPlainText()
 }

const columns = [
  {
    name: "Hình Ảnh",
    cell: row => <img className='h-[45px] w-[45px] rounded-[3px]' height="45px" width="45px" alt="thumbnail" src={`http://18.140.66.234${row.thumbnail}`} />,
    width:"150px",
    style: {
      height: '72px', 
    },
  },
  {
    name: "Tiêu Đề",
    selector: (row) => row.title,
    sortable: true,
    width:"200px"
  },
  {
    name: "Mô Tả Ngắn",
    selector: (row) => row.shortDescription,
    sortable: true,
    width:"300px"
  },
  {
    name: "Nội dung",
    selector: (row) => htmlToDraftBlocks(row.content.toString()),
    sortable: true,
    width:"300px"
  },
  {
    name: "Chức Năng",
    selector: (row) => (
      <div className="action--item flex items-center justify-center relative">
        <button
          className="btn-action update-handle"
          onClick={() => {
            setRowId(row.id)
            setUpdateShow(true)
            setNotificationId(row.id)
          }}
        >
          Sửa
        </button>
        <button
          className="btn-action delete-handle"
          onClick={() => {
            setRowId(row.id)
            setDeleteShow(true)
          }}
        >
          Xóa
        </button>
        <div
          className="btn-action "
        >
          <img onClick={() => {
            setRowId(row.id)
            setDetailShow(true)
            }} className='cursor-pointer w-[34px] h-[28px]' src={pencil} alt="" />
        </div>
      </div>
    ),
  },
];
  useEffect(
    ()=>{
      getData()
    },[keyFresh]
  )
  return (
    <div className="col l-10 m-[30px_50px]">
      {!loading &&
        <DataTable
          title="Danh sách tin tức"
          columns={columns}
          data={notification}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="400px"
          // selectableRows
          // selectableRowsHighlight={false}
          actions={
            <div>
              <button className="btn flex items-center justify-center  outline-none p-[10px] w-[90px] h-[40px] bg-[#29d21a] rounded-[5px] text-white mr-[15px]" onClick={() =>{setCreateShow(true)}}>
                Tạo
              </button>
            </div>
          }
          dense
        />
      }
      <UpdateNotification updateShow={updateShow} setUpdateShow={setUpdateShow} notificationId={notificationId} setNotificationId={setNotificationId} keyFresh={keyFresh} setKeyFresh={setKeyFresh}/>
      <CreateNotification createShow={createShow} setCreateShow={setCreateShow}  keyFresh={keyFresh} setKeyFresh={setKeyFresh}/>
      <Details getSingleData="http://18.140.66.234/api/v1/notifications/" rowId={rowId} setRowId={setRowId} detailShow={detailShow} setDetailShow={setDetailShow}/>
      <ConfirmDelete onClick={() => {handleDeleteNotification(rowId)}}  deleteShow={deleteShow} setDeleteShow={setDeleteShow} keyFresh={keyFresh} setKeyFresh={setKeyFresh}/>
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
}

export default Notification;
