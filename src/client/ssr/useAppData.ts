/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { useContext } from "react";
import { AppDataContext } from "./appData";

const useAppData = () => {
    return useContext(AppDataContext);
};

export { useAppData };
