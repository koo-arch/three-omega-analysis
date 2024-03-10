import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostFlag {
    flag: boolean,
}

const initialState: PostFlag = {
    flag: false,
}

const postFlagSlice = createSlice({
    name: 'postFlag',
    initialState,
    reducers: {
        setPostFlag: (state, action: PayloadAction<PostFlag>) => {
            state.flag = action.payload.flag;
        }
    }
});

export const { setPostFlag } = postFlagSlice.actions;
export default postFlagSlice.reducer;