/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { configureStore } from "@reduxjs/toolkit";
import { dateTypeSlice } from "./features/dateType";
import { loadingSlice } from "./features/loadingSlice";
import { statusSlice } from "./features/statusSlice";
import { tableDataSlice } from "./features/tableDataSlice";

export const store = configureStore({
    reducer: {
        status: statusSlice.reducer,
        tabelData: tableDataSlice.reducer,
        dateType: dateTypeSlice.reducer,
        loading: loadingSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
