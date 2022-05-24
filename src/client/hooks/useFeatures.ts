/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { useAppData } from "src/client/ssr/useAppData";

const useFeature = (feature: string, defaultValue = false) => {
    return useAppData().features[feature] || defaultValue;
};

export { useFeature };
