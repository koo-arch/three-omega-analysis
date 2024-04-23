import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UploadedDataState {
    data: UploadedData | null;
}

interface UploadedData {
    id: number;
    name: string;
    data: FileData;
}

interface FileData {
    [fileName: string]: MeasurementData[]
}

interface MeasurementData {
    "Current_Freq(Hz)": number;
    "Heater_Freq(Hz)": number;
    "Vomega(V)": number;
    "ImVomega(V)": number;
    "V3omega(V)": number;
    "ImV3omega(V)": number;
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