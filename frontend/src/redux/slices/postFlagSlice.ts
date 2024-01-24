import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostFlag {
    postFlag: boolean,
}

const initialState: PostFlag = {
    postFlag: false,
}

const postFlagSlice = createSlice({
    name: 'postFlag',
    initialState,
    reducers: {
        setPostFlag: (state, action: PayloadAction<PostFlag>) => {
            state.postFlag = action.payload.postFlag;
        }
    }
});

export const { setPostFlag } = postFlagSlice.actions;
export default postFlagSlice.reducer;