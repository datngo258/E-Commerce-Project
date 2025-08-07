import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis/app";

// định nghĩa một thunk bất đồng bộ để gọi API : getcategories  ===> dễ dàng tái sử dụng hơn
export const getCategories = createAsyncThunk(
  "app/categories",
  async (data, { rejectWithValue }) => {
    const response = await apis.apiGetCategories();
    if (!response.success) return rejectWithValue(response);
    return response.categories;
  }
);

