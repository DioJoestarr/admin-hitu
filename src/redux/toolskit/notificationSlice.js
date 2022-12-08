import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from '../../API/NotificationAPI';


const initialState = {
  data: [],
  loading: false,
  error: undefined,
};

//---------------------------------NOTIFICATION---------------------------------------//

export const getListNotification = createAsyncThunk(
  "users_admin/list_notification",
  async (payload, thunkApi) => {
    const {data} = await API.getListNotificationAPI(payload.page, payload.size);
    return data.data;
  }
);

export const getPageNotification = createAsyncThunk(
"users_admin/page_notification",
async (payload, thunkApi) => {
  const {data} = await API.getPageNotification(payload.page, payload.size);
  return data.data;
}
);

//------------------------------USER-----------------------------------------//

export const deleteSingleUser = createAsyncThunk(
  'users_admin/delete_single_user',
  async (payload, thunkApi) => {
    const data = await API.deleteSingleUser(payload);
    return data;
  }
)

export const deleteMutipleUser = createAsyncThunk(
  'users_admin/delete_mutiple_user',
  async (payload, thunkApi) => {
    const data = await API.deleteMutipleUser(payload);
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