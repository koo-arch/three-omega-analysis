import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingState {
    isLoading: boolean;
    data: Setting | null;
}

interface Setting {
    items: SettingData[];
}

interface SettingData {
    name: string;
    dRdT: number;
    length: number;
}

const initialState: SettingState = {
    isLoading: true,
    data: null,
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        fetchSettingSuccess: (state, action: PayloadAction<Setting>) => {
            state.isLoading = false;
            state.data = action.payload;
        },
    },
});

export const { fetchSettingSuccess } = settingSlice.actions;
export default settingSlice.reducer;