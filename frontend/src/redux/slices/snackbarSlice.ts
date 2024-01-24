import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
    open: boolean;
    severity: "success" | "info" | "warning" | "error";
    message: string;
}

const initialState: SnackbarState = {
    open: false,
    severity: "success",
    message: "",
};

const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        setSnackbar: (state, action: PayloadAction<SnackbarState>) => {
            state.open = action.payload.open;
            state.severity = action.payload.severity;
            state.message = action.payload.message;
        }
    },
});

export const { setSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;