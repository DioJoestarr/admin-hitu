import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "./toolskit/userSlice";

const reducers = combineReducers({
    userState: userSlice,
})


export const store = configureStore({
  reducer: reducers,
  middleware: (gDM) => gDM({
    serializableCheck: false
  })
});
