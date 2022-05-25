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

import { FormikCreateBarangModel } from "@/server/models/inventories/dto/item/create-item.schema";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { fetch } from "@/shared/utils/fetch";

type PageProps = {
    categories: string[];
};

const ActionsCreateKategori: NextPage<PageProps> = ({ categories }) => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const formik = useFormik({
        initialValues: new FormikCreateBarangModel(),
        onSubmit: (form) => {
            console.log(form);
            setMessage("tunggu..");

            // create payload object
            const payload = {
                nama: form.nama,
                satuan: form.satuan,
                saldo_jumlah_satuan: form.saldo_jumlah_satuan,
                saldo_harga_satuan: form.saldo_harga_satuan,
                saldo_akhir_jumlah_satuan: form.saldo_akhir_jumlah_satuan,
                saldo_akhir_harga_satuan: form.saldo_akhir_harga_satuan,
                mutasi_barang_masuk_jumlah_satuan: form.mutasi_barang_masuk_jumlah_satuan,
                mutasi_barang_masuk_harga_satuan: form.mutasi_barang_masuk_harga_satuan,
                mutasi_barang_keluar_jumlah_satuan: form.mutasi_barang_keluar_jumlah_satuan,
                mutasi_barang_keluar_harga_satuan: form.mutasi_barang_keluar_harga_satuan,
                kategori: form.kategori,
            };

            setSubmitted(true);

            axios
                .post("/api/data/inventory/create/barang", payload)
                .then((response) => {
                    setMessage("sukses");
                })
                .catch((error) => {
                    setMessage("not sukses");
                });
        },
        validate: FormikCreateBarangModel.createValidator(),
    });
    return (
        <div className="section container">
            <div className="block">
                <h1 className="title">Bikin barang baru.</h1>
            </div>
            <div className="block">
                <div className="notification" hidden={!submitted}>
                    {message}
                </div>
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="field">
                        <label className="label">Kategori</label>
                        <div className="control">
                            <div className="select">
                                <select
                                    name="kategori"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.kategori}
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Uraian Barang</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id="nama"
                                placeholder="e.g Alex Smith"
                                value={formik.values.nama}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.nama && <span className="tag is-warning">{formik.errors.nama}</span>}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Satuan Barang</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                id="satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.satuan && <span className="tag is-warning">{formik.errors.satuan}</span>}
                        </div>
                    </div>

                    <br />
                    <p className="subtitle">Saldo</p>
                    <br />

                    <div className="field">
                        <label className="label">Saldo: Jumlah Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="saldo_jumlah_satuan"
                                id="saldo_jumlah_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.saldo_jumlah_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.saldo_jumlah_satuan && (
                                <span className="tag is-warning">{formik.errors.saldo_jumlah_satuan}</span>
                            )}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Saldo: Harga Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="saldo_harga_satuan"
                                id="saldo_harga_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.saldo_harga_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.saldo_harga_satuan && (
                                <span className="tag is-warning">{formik.errors.saldo_harga_satuan}</span>
                            )}
                        </div>
                    </div>

                    <br />
                    <p className="subtitle">Saldo Akhir</p>
                    <br />

                    <div className="field">
                        <label className="label">Saldo Akhir: Jumlah Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="saldo_akhir_jumlah_satuan"
                                id="saldo_akhir_jumlah_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.saldo_akhir_jumlah_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.saldo_akhir_jumlah_satuan && (
                                <span className="tag is-warning">{formik.errors.saldo_akhir_jumlah_satuan}</span>
                            )}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Saldo Akhir: Harga Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="saldo_akhir_harga_satuan"
                                id="saldo_akhir_harga_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.saldo_akhir_harga_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.saldo_akhir_harga_satuan && (
                                <span className="tag is-warning">{formik.errors.saldo_akhir_harga_satuan}</span>
                            )}
                        </div>
                    </div>

                    <br />
                    <p className="subtitle">Mutasi Barang Masuk</p>
                    <br />

                    <div className="field">
                        <label className="label">Mutasi Barang Masuk: Jumlah Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="mutasi_barang_masuk_jumlah_satuan"
                                id="mutasi_barang_masuk_jumlah_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.mutasi_barang_masuk_jumlah_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.mutasi_barang_masuk_jumlah_satuan && (
                                <span className="tag is-warning">
                                    {formik.errors.mutasi_barang_masuk_jumlah_satuan}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Mutasi Barang Masuk: Harga Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="mutasi_barang_masuk_harga_satuan"
                                id="mutasi_barang_masuk_harga_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.mutasi_barang_masuk_harga_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.mutasi_barang_masuk_harga_satuan && (
                                <span className="tag is-warning">{formik.errors.mutasi_barang_masuk_harga_satuan}</span>
                            )}
                        </div>
                    </div>

                    <br />
                    <p className="subtitle">Mutasi Barang Keluar</p>
                    <br />

                    <div className="field">
                        <label className="label">Mutasi Barang Keluar: Jumlah Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="mutasi_barang_keluar_jumlah_satuan"
                                id="mutasi_barang_keluar_jumlah_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.mutasi_barang_keluar_jumlah_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.mutasi_barang_keluar_jumlah_satuan && (
                                <span className="tag is-warning">
                                    {formik.errors.mutasi_barang_keluar_jumlah_satuan}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Mutasi Barang Keluar: Harga Satuan</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="mutasi_barang_keluar_harga_satuan"
                                id="mutasi_barang_keluar_harga_satuan"
                                placeholder="e.g Alex Smith"
                                value={formik.values.mutasi_barang_keluar_harga_satuan}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.mutasi_barang_keluar_harga_satuan && (
                                <span className="tag is-warning">
                                    {formik.errors.mutasi_barang_keluar_harga_satuan}
                                </span>
                            )}
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

export const getServerSideProps = buildServerSideProps<PageProps>(async () => {
    const categories: any = await fetch("/api/data/inventory/categories");

    return { categories };
});

export default ActionsCreateKategori;
