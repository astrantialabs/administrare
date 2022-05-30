import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 3,
};

export const statusSlice = createSlice({
    name: "status",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { setStatus } = statusSlice.actions;
