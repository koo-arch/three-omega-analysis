import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileData } from '@/types/features/analysis';

interface UploadedDataState {
    data: UploadedData | null;
}

interface UploadedData {
    id: number;
    name: string;
    data: FileData;
}

const initialState: UploadedDataState = {
    data: null,
};

const uploadedDataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setUploadedData: (state, action: PayloadAction<UploadedData>) => {
            state.data = action.payload;
        },
        updateFileData: (state, action: PayloadAction<FileData>) => {
            if (state.data) {
                state.data.data = action.payload;
            }
        },
        resetUploadedData: (state) => {
            state.data = null;
        }
    },
});

export const { setUploadedData, updateFileData, resetUploadedData } = uploadedDataSlice.actions;
export default uploadedDataSlice.reducer;