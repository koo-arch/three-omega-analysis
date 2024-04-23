import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadErrorState {
    error: UploadError | null;
}

interface UploadError {
    [fileName: string]: string[];
}

const initialState: UploadErrorState = {
    error: null
};

const uploadErrorSlice = createSlice({
    name: 'uploadError',
    initialState,
    reducers: {
        setUploadError: (state, action: PayloadAction<UploadError>) => {
            state.error = action.payload;
        },
        clearUploadError: (state) => {
            state.error = null;
        }
    }
});

export const { setUploadError, clearUploadError } = uploadErrorSlice.actions;
export default uploadErrorSlice.reducer;