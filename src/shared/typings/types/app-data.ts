/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { Config } from "./config";

export type AppData = Pick<Config, "basePath" | "features">;
