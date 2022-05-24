/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { createContext } from "react";
import { AppData } from "src/shared/typings/types/app-data";

const AppDataContext = createContext<AppData>({} as AppData);

export { AppDataContext };
