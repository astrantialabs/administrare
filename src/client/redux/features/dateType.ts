import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DateTypeState {
    value: number;
}

const initialState: DateTypeState = {
    value: 2,
};

export const dateTypeSlice = createSlice({
    name: "dateType",
    initialState,
    reducers: {
        setDateType: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { setDateType } = dateTypeSlice.actions;
