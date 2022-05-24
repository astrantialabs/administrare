/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { NextPage } from "next";

type PageProps = {
    test: string;
};

const Home: NextPage = () => {
    return (
        <div>
            <h1 className="title">Home</h1>
        </div>
    );
};

export default Home;
