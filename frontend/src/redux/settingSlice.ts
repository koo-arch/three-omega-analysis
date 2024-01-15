import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingState {
    isLoading: boolean;
    data: Setting[];
}

interface Setting {
    id: number;
    name: string;
    dRdT: number;
    length: number;
}

const initialState: SettingState = {
    isLoading: true,
    data: [],
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        fetchSettingSuccess: (state, action: PayloadAction<Setting[]>) => {
            state.isLoading = false;
            state.data = action.payload;
        },
    },
});

export const { fetchSettingSuccess } = settingSlice.actions;
export default settingSlice.reducer;