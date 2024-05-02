import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedPoints } from '@/types/features/graph';

interface SelectedPointsState {
    [graphName: string]: SelectedPoints;
}

interface GraphPoints {
    graphName: string;
    points: SelectedPoints;
}

const initialState: SelectedPointsState = {};

const selectedPointsSlice = createSlice({
    name: 'selectedPoints',
    initialState,
    reducers: {
        setSelectedPoints: (state, action: PayloadAction<GraphPoints>) => {
            const { graphName, points } = action.payload;
            state[graphName] = points;
        }
    }
});

export const { setSelectedPoints } = selectedPointsSlice.actions;
export default selectedPointsSlice.reducer;