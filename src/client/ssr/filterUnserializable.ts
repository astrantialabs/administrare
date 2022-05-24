/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

const filterUnserializable = (obj: Record<string, unknown>, filteredValues: unknown[] = [undefined]) => {
    Object.keys(obj).forEach((key) => {
        if (filteredValues.includes(obj[key])) {
            delete obj[key];
            return;
        }

        if (obj[key] === Object(obj[key]) && !Array.isArray(obj[key])) {
            filterUnserializable(obj[key] as Record<string, unknown>, filteredValues);
        }
    });

    return obj;
};

export { filterUnserializable };
