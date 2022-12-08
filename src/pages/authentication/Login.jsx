import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
import "./Login.scss";



const Login = () => {
    // const [loading, setLoading] = useState(false);
    localStorage.removeItem("isAuthenticated");
  
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin@2022");
  
    const history = useNavigate();
  
    const {loading} = useSelector(state => state.userState)
  
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://18.140.66.234/api/auth/login";
        await axios.post(url,
          {
            username: username,
            password: password,
          },{
            referrerPolicy: "unsafe_url" 
          }
        ).then(({data}) => {
            localStorage.setItem("accessToken",JSON.stringify(data.accessToken) );
            history("/Teachers")
            window.location.reload();
        })
        
      };
      
    return (
        <div className="login-box">
            <h2>Login</h2>
            <form>
                <div className="user-box">
                <input 
                type="text" 
                name="username" 
                value = {username}
                onChange={(e) => { setUsername(e.target.value) }}
                required=""/>
                <label>Username</label>
                </div>
                <div className="user-box">
                <input 
                type="password" 
                name="password" 
                value = {password}
                // onChange={(e)=>{
                //     setObj((old)=>{
                //       const newobj = {...obj,password:e.target.value};
                //       return newobj
                //     }) 
                //   }}
                onChange={(e) => { setPassword(e.target.value) }}
                required=""
                />
                <label>Password</label>
                </div>
                <a href="" onClick={handleSubmit}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
                </a>
            </form>
        </div>
    )

}

export default Login