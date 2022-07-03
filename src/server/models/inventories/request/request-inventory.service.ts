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

/**
 * @fileoverview The request inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { ResponseFormat } from "@/server/common/interceptors/response-format.interceptor";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";
import { JumlahData, RequestBarangExtended, RequestCreateBarang } from "@/shared/typings/types/inventory";
import { currentDate, responseFormat, slugifyDate } from "@/shared/utils/util";
import { readJSON } from "@/shared/utils/json";
import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import { Model } from "mongoose";
import { join } from "path";
import { MasterInventoryService } from "../master/master-inventory.service";
import { MasterBarang, MasterInventoryDataDocument, MasterKategori } from "../master/schema/master-inventory.schema";
import { RequestBarang, RequestInventoryData, RequestInventoryDataDocument } from "./schema/request-inventory.schema";
import { Cron, CronExpression } from "@nestjs/schedule";

/**
 * @class RequestInventoryService
 * @description The request inventory service.
 */
@Injectable()
export class RequestInventoryService {
    /**
     * @constructor
     * @description Creates a new request inventory data service.
     * @param {Model} requestInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(RequestInventoryData.name)
        private readonly requestInventoryDataModel: Model<RequestInventoryDataDocument>,
        private readonly masterInventoryService: MasterInventoryService
    ) {}

    /* ---------------------------------- MAIN ---------------------------------- */

    /**
     * @description Find request document based on year
     * @param {Number} year - The year
     * @returns {Promise<RequestInventoryDataDocument>} The request document
     */
    public async requestFindOne(year: number): Promise<RequestInventoryDataDocument> {
        return await this.requestInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /* --------------------------------- UTILITY -------------------------------- */

    public async requestBarangWithCategoryAndItemName(request_barang_data: RequestBarang[]): Promise<RequestBarangExtended[]> {
        let request_barang_data_with_category_and_item_name: RequestBarangExtended[] = await Promise.all(
            request_barang_data.map(async (item_object: RequestBarang) => {
                const master_item_object: MasterBarang = (
                    await this.masterInventoryService.masterGetBarangByKategoriIdAndBarangId(2022, item_object.kategori_id, item_object.barang_id)
                ).result.master_item;

                return {
                    ...item_object,
                    kategori_name: (await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, item_object.kategori_id)).result
                        .master_category_name,
                    barang_name: master_item_object.nama,
                    barang_unit: master_item_object.satuan,
                };
            })
        );

        return request_barang_data_with_category_and_item_name;
    }

    /* ---------------------------------- CRUD ---------------------------------- */

    /**
     * @description Get every request item object
     * @param {Number} year - The year
     * @returns {Promise<RequestBarang[]>} The request item object
     */
    public async requestGetBarangAll(year: number): Promise<ResponseFormat<ResponseObject<RequestBarangExtended[]>>> {
        try {
            const request_barang_data: RequestBarang[] = (await this.requestFindOne(year)).barang;

            const request_barang_data_with_category_and_item_name: RequestBarangExtended[] = await this.requestBarangWithCategoryAndItemName(
                request_barang_data
            );

            return responseFormat<ResponseObject<RequestBarangExtended[]>>(true, 200, "Permintaan barang berhasil ditemukan.", {
                request_item: request_barang_data_with_category_and_item_name,
            });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Get request item object based on id
     * @param {Number} year - The year
     * @param {Number} id - The id
     * @returns {Promise<RequestBarang>} The request item object
     */
    public async requestGetBarangById(year: number, id: number): Promise<ResponseFormat<ResponseObject<RequestBarangExtended>>> {
        try {
            const request_barang_data: RequestBarangExtended[] = (await this.requestGetBarangAll(year)).result.request_item;
            let request_barang: RequestBarangExtended;

            request_barang_data.forEach((item_object: RequestBarangExtended) => {
                if (item_object.id == id) {
                    request_barang = item_object;
                }
            });

            if (request_barang == undefined) {
                return responseFormat<null>(false, 400, `Permintaan barang gagal ditemukan.`, null);
            } else if (request_barang != undefined) {
                return responseFormat<ResponseObject<RequestBarangExtended>>(true, 200, `Permintaan barang berhasil ditemukan.`, {
                    request_item: request_barang,
                });
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Get request item object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang[]>} The request item object
     */
    public async requestGetBarangByStatus(year: number, status: number): Promise<ResponseFormat<ResponseObject<RequestBarangExtended[]>>> {
        try {
            const status_list: number[] = [0, 1, 2];

            if (status_list.includes(status)) {
                const request_barang_data: RequestBarangExtended[] = (await this.requestGetBarangAll(year)).result.request_item;
                let request_barang: RequestBarangExtended[] = [];

                request_barang_data.forEach((item_object: RequestBarangExtended) => {
                    if (item_object.status == status) {
                        request_barang.push(item_object);
                    }
                });

                return responseFormat<ResponseObject<RequestBarangExtended[]>>(true, 200, `Permintaan barang berhasil ditemukan.`, {
                    request_item: request_barang,
                });
            } else if (!status_list.includes(status)) {
                return responseFormat<null>(false, 400, `Status tidak valid.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Create a new request barang object
     * @param {Number} year - The year
     * @param {RequestBarang} item - The new request barang object
     * @returns {Promise<RequestBarang>} The new request barang object
     */
    public async requestCreateBarang(year: number, item: RequestCreateBarang): Promise<ResponseFormat<ResponseObject<RequestBarang>>> {
        try {
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(item.username)) {
                const master_data: MasterInventoryDataDocument = await this.masterInventoryService.masterFindOne(year);

                let category_id_is_valid: boolean = false;
                let item_id_is_valid: boolean = false;
                let category_id_is_active: boolean;
                let item_id_is_active: boolean;
                master_data.kategori.forEach((category_object: MasterKategori) => {
                    if (category_object.id == item.kategori_id) {
                        category_id_is_valid = true;
                        category_id_is_active = category_object.active;

                        category_object.barang.forEach((item_object: MasterBarang) => {
                            if (item_object.id == item.barang_id) {
                                item_id_is_valid = true;
                                item_id_is_active = item_object.active;
                            }
                        });
                    }
                });

                if (category_id_is_valid) {
                    if (category_id_is_active) {
                        if (item_id_is_valid) {
                            if (item_id_is_active) {
                                if (item.total > 0) {
                                    const jumlah_data: JumlahData = await this.masterInventoryService.masterGetSaldoAkhirAndPermintaanByKategoriIdAndBarangId(
                                        2022,
                                        item.kategori_id,
                                        item.barang_id
                                    );

                                    if (jumlah_data.saldo_akhir >= jumlah_data.permintaan + item.total) {
                                        const request_inventory_data: RequestInventoryDataDocument = await this.requestFindOne(year);

                                        const new_item: RequestBarang = {
                                            id: (await this.requestGetBarangAll(2022)).result.request_item.length + 1,
                                            kategori_id: item.kategori_id,
                                            barang_id: item.barang_id,
                                            username: item.username,
                                            total: parseInt(item.total as unknown as string),
                                            deskripsi: item.deskripsi,
                                            created_at: currentDate(),
                                            responded_at: null,
                                            status: 0,
                                        };

                                        request_inventory_data.barang.push(new_item);

                                        this.masterInventoryService.masterIncreaseJumlahPermintaanByKategoriIdAndBarangId(
                                            2022,
                                            new_item.kategori_id,
                                            new_item.barang_id,
                                            new_item.total
                                        );

                                        this.requestInventoryDataModel.replaceOne({ tahun: year }, request_inventory_data, { upsert: true }).exec();

                                        return responseFormat<ResponseObject<RequestBarang>>(true, 201, `Permintaan barang berhasil dibuat.`, {
                                            request_item: new_item,
                                        });
                                    } else if (jumlah_data.saldo_akhir < jumlah_data.permintaan + item.total) {
                                        return responseFormat<null>(false, 400, `Saldo tidak cukup.`, null);
                                    }
                                } else if (item.total <= 0) {
                                    return responseFormat<null>(false, 400, `Total saldo barang yang diminta harus lebih dari 0.`, null);
                                }
                            } else if (!item_id_is_active) {
                                return responseFormat<null>(false, 400, `Barang sudah dihapus.`, null);
                            }
                        } else if (!item_id_is_valid) {
                            return responseFormat<null>(false, 400, `Barang gagal ditemukan.`, null);
                        }
                    } else if (!category_id_is_active) {
                        return responseFormat<null>(false, 400, `Kategori sudah dihapus.`, null);
                    }
                } else if (!category_id_is_valid) {
                    return responseFormat<null>(false, 400, `Kategori gagal ditemukan.`, null);
                }
            } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(item.username)) {
                return responseFormat<null>(false, 400, `Nama tidak boleh memiliki simbol.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Response an barang object based on id and status
     * @param {Number} year - The year
     * @param {Number} id - The barang id
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang>} Return the responded barang object
     */
    public async requestResponseBarangById(year: number, id: number, status: number): Promise<ResponseFormat<ResponseObject<RequestBarang>>> {
        try {
            const request_data: RequestInventoryDataDocument = await this.requestFindOne(year);

            let request_id_is_valid: boolean = false;
            request_data.barang.forEach((request_item_object: RequestBarang) => {
                if (request_item_object.id == id) {
                    request_id_is_valid = true;
                }
            });

            if (request_id_is_valid) {
                const status_list: number[] = [1, 2];

                if (status_list.includes(status)) {
                    let responded_request_barang: RequestBarang;

                    let status_is_valid: boolean = false;
                    request_data.barang.forEach((request_item_object: RequestBarang) => {
                        if (request_item_object.id == id) {
                            if (request_item_object.status == 0) {
                                request_item_object.responded_at = currentDate();
                                request_item_object.status = status;
                                this.masterInventoryService.masterResponseJumlahPermintaanByKategoriIdAndBarangId(
                                    2022,
                                    request_item_object.kategori_id,
                                    request_item_object.barang_id,
                                    request_item_object.total,
                                    request_item_object.status
                                );

                                responded_request_barang = request_item_object;
                                status_is_valid = true;
                            }
                        }
                    });

                    if (status_is_valid) {
                        this.requestInventoryDataModel.replaceOne({ tahun: year }, request_data, { upsert: true }).exec();

                        return responseFormat<ResponseObject<RequestBarang>>(true, 202, `Permintaan barang berhasil direspon.`, {
                            request_item: responded_request_barang,
                        });
                    } else if (!status_is_valid) {
                        return responseFormat<null>(false, 400, `Permintaan barang sudah pernah direspon.`, null);
                    }
                } else if (!status_list.includes(status)) {
                    return responseFormat<null>(false, 400, `Status tidak valid.`, null);
                }
            } else if (!request_id_is_valid) {
                return responseFormat<null>(false, 400, `Permintaan barang gagal ditemukan.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    public async requestCancelBarangById(year: number, id: number): Promise<ResponseFormat<ResponseObject<RequestBarang>>> {
        try {
            const request_data: RequestInventoryDataDocument = await this.requestFindOne(year);

            let request_id_is_valid: boolean = false;
            let request_is_cancelable: boolean = false;
            request_data.barang.forEach((request_item_object: RequestBarang) => {
                if (request_item_object.id == id) {
                    request_id_is_valid = true;

                    if (request_item_object.status == 1) {
                        request_is_cancelable = true;
                    }
                }
            });

            if (request_id_is_valid) {
                if (request_is_cancelable) {
                    let responded_request_barang: RequestBarang;

                    request_data.barang.forEach((request_item_object: RequestBarang) => {
                        if (request_item_object.id == id) {
                            request_item_object.responded_at = null;
                            request_item_object.status = 0;

                            this.masterInventoryService.masterCancelAcceptedRequest(
                                2022,
                                request_item_object.kategori_id,
                                request_item_object.barang_id,
                                request_item_object.total
                            );

                            responded_request_barang = request_item_object;
                        }
                    });

                    this.requestInventoryDataModel.replaceOne({ tahun: year }, request_data, { upsert: true }).exec();

                    return responseFormat<ResponseObject<RequestBarang>>(true, 202, `Permintaan barang berhasil dibatalkan.`, {
                        request_item: responded_request_barang,
                    });
                } else if (!request_is_cancelable) {
                    return responseFormat<null>(false, 400, `Permintaan barang tidak bisa dibatalkan.`, null);
                }
            } else if (!request_id_is_valid) {
                return responseFormat<null>(false, 400, `Permintaan barang gagal ditemukan.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    public async requestDownloadOption() {
        const response = await pythonAxiosInstance.post("/__api/inventory/request/update/option");

        if (response.data.success) {
            return readJSON("./scripts/json/request_option_data.json");
        }
    }

    public async requestDownloadByUserIdAndDateId(user_id: number, date_id: number, res: any): Promise<StreamableFile> {
        const option_data = readJSON("./scripts/json/request_option_data.json");

        let username_value: string;
        let date_value: string;
        let is_creatable: boolean;
        option_data.forEach((user_object: any) => {
            if (user_object.id == user_id) {
                username_value = user_object.name;

                user_object.date.forEach((date_object: any) => {
                    if (date_object.id == date_id) {
                        date_value = date_object.date;
                        is_creatable = date_object.creatable;
                    }
                });
            }
        });

        const slugified_date = slugifyDate(date_value);

        if (username_value == "Mentah") {
            if (date_value == "Terbaru" && is_creatable == true) {
                const current_date = slugifyDate(currentDate());
                const response = await pythonAxiosInstance.post(`/__api/inventory/request/download/raw/${current_date}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${current_date}.xlsx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${current_date}.xlsx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (date_value != "Terbaru" && is_creatable == false) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.xlsx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.xlsx"`,
                });

                return new StreamableFile(file);
            }
        } else if (username_value != "Mentah") {
            if (is_creatable) {
                const response = await pythonAxiosInstance.post(`/__api/inventory/request/download/user/${user_id}/date/${date_id}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.docx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.docx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (!is_creatable) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.docx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.docx"`,
                });

                return new StreamableFile(file);
            }
        }
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    public async requestScheduledDownload() {
        const current_date = slugifyDate(currentDate());
        const response = await pythonAxiosInstance.post(`/__api/inventory/request/download/raw/${current_date}`);

        if (response.data.success) {
            pythonAxiosInstance.post("/__api/inventory/request/update/option");
        }
    }
}
