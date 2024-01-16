import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedPointsState {
    [graphName: string]: number[];
}

const initialState: SelectedPointsState = {};

export const selectedPointsSlice = createSlice({
    name: 'selectedPoints',
    initialState,
    reducers: {
        updateSelectedPoints: (state, action: PayloadAction<{ graphName: string, points: number[] }>) => {
            const { graphName, points } = action.payload;
            state[graphName] = points;
        },
    },
});

export const { updateSelectedPoints } = selectedPointsSlice.actions;
export default selectedPointsSlice.reducer;
