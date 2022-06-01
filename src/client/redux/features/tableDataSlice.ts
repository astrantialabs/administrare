import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
    data: any;
}

const initialState: CounterState = {
    data: undefined,
};

export const tableDataSlice = createSlice({
    name: "tableData",
    initialState,
    reducers: {
        setTableData: (state, action: PayloadAction<any>) => {
            state.data = action.payload;
        },
    },
});

export const { setTableData } = tableDataSlice.actions;
