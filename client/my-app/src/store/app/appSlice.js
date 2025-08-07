import { createSlice } from "@reduxjs/toolkit";
import * as actions from "../app/asyncActions";

// createSlice là một hàm của Redux Toolkit giúp tạo ra một slice của state, bao gồm reducers và actions
// Ngoài các  action tự định nghĩa  thì redux toolkit còn cung cấp các action như pending, fulfilled, rejected cho các async thunk
// Các action này sẽ được gọi tự động khi các async thunk được thực thi, giúp quản

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: [],
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(actions.getCategories.fulfilled, (state, action) => {
      console.log("✅ fulfilled payload:", action.payload);
      state.isLoading = false;
      state.categories = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(actions.getCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});
export const {} = appSlice.actions;

export default appSlice.reducer;
