/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 imperatoria
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

import { NextPage } from "next";

import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { FormikCreateBarangModel } from "@server/models/inventories/dto/create-item.schema";
import { buildServerSideProps } from "@client/ssr/buildServerSideProps";
import { fetch } from "@shared/utils/fetch";
import { FormikCreateKategoriModel } from "@server/models/inventories/dto/create-category.schema";

type PageProps = {
    categories: string[];
};

const ActionsCreateKategori: NextPage<PageProps> = ({ categories }) => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: new FormikCreateKategoriModel(),
        onSubmit: (form) => {
            setMessage("tunggu..");

            const payload = {
                kategori: form.kategori,
            };

            setSubmitted(true);

            axios
                .post("/api/data/inventory/create/kategori", payload)
                .then((response) => {
                    setMessage("sukses");
                })
                .catch((error) => {
                    setMessage("not sukses");
                });
        },
        validate: FormikCreateKategoriModel.createValidator(),
    });
    return (
        <div className="section container">
            <div className="block">
                <h1 className="title">Bikin kategori baru.</h1>
            </div>
            <div className="block">
                <div className="notification" hidden={!submitted}>
                    {message}
                </div>
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="field">
                        <label className="label">Kategori</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id="kategori"
                                placeholder="e.g Alex Smith"
                                value={formik.values.kategori}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.kategori && <span className="tag is-warning">{formik.errors.kategori}</span>}
                        </div>
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button" type="submit" disabled={submitted}>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActionsCreateKategori;
