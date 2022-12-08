import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TeacherList from '../../API/TeacherAPI';
import userApi from '../../API/UserAPI';


const initialState = {
  data: [],
  loading: false,
  error: undefined,
};

export const login = createAsyncThunk(
  "users/login",
  async (payload, thunkApi) => {
    const data = await userApi.postLoginUser(payload);
    console.log(data);
    return data;
  }
);

export const getListTeacherPerPage = createAsyncThunk(
    "users/list_teacher_users",
    async (payload, thunkApi) => {
      const {data} = await TeacherList.getTeacherListAPI(payload.page, payload.size);
      return data.data;
    }
  );

export const getSingleTeacher = createAsyncThunk(
  "users/single_teacher",
  async (payload, thunkApi) => {
    const {data} = await TeacherList.getSingleTeacher(payload);
    return data.data;
  }
);

export const deleteSingleUser = createAsyncThunk(
  'users/delete_single_user',
  async (payload, thunkApi) => {
    const data = await TeacherList.deleteSingleUser(payload);
    return data;
  }
)

export const deleteMutipleUser = createAsyncThunk(
  'users/delete_mutiple_user',
  async (payload, thunkApi) => {
    const data = await TeacherList.deleteMutipleUser(payload);
    return data;
  }
)

  
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (buidler) => {
      buidler
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("users/") && action.type.endsWith("/pending")
            );
          },
          (state, action) => {
            state.loading = true;
          }
        )
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("users/") &&
              action.type.endsWith("/fulfilled")
            );
          },
          (state, action) => {
            state.loading = false;
            state.data = action.payload;
          }
        )
        .addMatcher(
          (action) => {
            return (
              action.type.startsWith("users/") &&
              action.type.endsWith("/rejected")
            );
          },
          (state, action) => {
            state.loading = false;
            state.error = action.error;
          }
        );
    },
  });
  
  export default userSlice.reducer;