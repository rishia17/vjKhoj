import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage (if exists)
const userFromStorage = JSON.parse(localStorage.getItem("user"));

export const userLoginThunk = createAsyncThunk(
  'userLogin',
  async (userCredObj, thunkApi) => {
    try {
      const res = await axios.post('http://localhost:8000/user-api/login', userCredObj);
      
      if (res.data.message === 'Login successful') {
        console.log('lesss goo');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data;
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user-login',
  initialState: {
    isPending: false,
    loginUserStatus: !!userFromStorage, // true if user exists in localStorage
    currentUser: userFromStorage || {},
    errorOccurred: false,
    errMsg: ''
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.loginUserStatus = false;
      state.currentUser = {};
      state.errorOccurred = false;
      state.errMsg = '';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentUser = action.payload.user;
        state.loginUserStatus = true;
        state.errMsg = '';
        state.errorOccurred = false;
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = {};
        state.loginUserStatus = false;
        state.errMsg = action.payload;
        state.errorOccurred = true;
      });
  }
});

export const { resetState } = userSlice.actions;

export default userSlice.reducer;
