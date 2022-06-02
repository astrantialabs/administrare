import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
    value: boolean;
}

const initialState: CounterState = {
    value: false,
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload;
        },
    },
});

export const { setLoading } = loadingSlice.actions;
