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
 * @fileoverview The demand inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { ResponseFormat } from "@/server/common/interceptors/response-format.interceptor";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";
import { DemandBarangWithCategoryName, DemandCreateBarang, DemandCreateKategori } from "@/shared/typings/types/inventory";
import { currentDate, readJSON, responseFormat, slugifyDate } from "@/shared/utils/util";
import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import { Model } from "mongoose";
import { join } from "path";
import { MasterInventoryService } from "../master/master-inventory.service";
import { MasterInventoryDataDocument, MasterKategori } from "../master/schema/master-inventory.schema";
import { DemandBarang, DemandInventoryData, DemandInventoryDataDocument, DemandKategori } from "./schema/demand-inventory.schema";
import { Cron, CronExpression } from "@nestjs/schedule";

/**
 * @class DemandInventoryService
 * @description The demand inventory service.
 */
@Injectable()
export class DemandInventoryService {
    /**
     * @constructor
     * @description Creates a new demand inventory service.
     * @param {Model} demandInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(DemandInventoryData.name)
        private readonly demandInventoryDataModel: Model<DemandInventoryDataDocument>,
        private readonly masterInventoryService: MasterInventoryService
    ) {}

    /* ---------------------------------- MAIN ---------------------------------- */

    /**
     * @description Find demand documnet based on year
     * @param {Number} year - The year
     * @returns {DemandInventoryDataDocument} The demand document
     */
    public async demandFindOne(year: number): Promise<DemandInventoryDataDocument> {
        return await this.demandInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /* --------------------------------- UTILITY -------------------------------- */

    public async demandBarangWithCategoryName(demand_barang_data: DemandBarang[]): Promise<DemandBarangWithCategoryName[]> {
        let demand_barang_data_with_category_name: DemandBarangWithCategoryName[] = await Promise.all(
            demand_barang_data.map(async (item_object: DemandBarang) => {
                return {
                    ...item_object,
                    kategori_name: (await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, item_object.kategori_id)).result
                        .master_category_name,
                };
            })
        );

        return demand_barang_data_with_category_name;
    }

    /* ---------------------------------- CRUD ---------------------------------- */

    /**
     * @description Get every category demand object
     * @param {Number} year - The year data
     * @returns {Promise<DemandKategori[]>} - The category demand object
     */
    public async demandGetKategoriAll(year: number): Promise<ResponseFormat<ResponseObject<DemandKategori[]>>> {
        try {
            const category_data: DemandKategori[] = (await this.demandFindOne(year)).kategori;

            return responseFormat<ResponseObject<DemandKategori[]>>(true, 200, "Pengajuan kategori berhasil ditemukan.", { demand_category: category_data });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Get every item demand object
     * @param {Number} year - The year data
     * @returns {Promise<DemandBarang[]>} The item demand object
     */
    public async demandGetBarangAll(year: number): Promise<ResponseFormat<ResponseObject<DemandBarangWithCategoryName[]>>> {
        try {
            let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;

            let demand_barang_data_with_category_name: DemandBarangWithCategoryName[] = await this.demandBarangWithCategoryName(demand_barang_data);

            return responseFormat<ResponseObject<DemandBarangWithCategoryName[]>>(true, 200, "Pengajuan barang berhasil ditemukan.", {
                demand_item: demand_barang_data_with_category_name,
            });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description  Get category demand object based on id
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @returns {Promise<DemandKategori>} The category demand object
     */
    public async demandGetKategoriById(year: number, id: number): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        try {
            let demand_kategori_data: DemandKategori[] = (await this.demandFindOne(year)).kategori;
            let demand_kategori: DemandKategori;

            demand_kategori_data.forEach((demand_kategori_object: DemandKategori) => {
                if (demand_kategori_object.id == id) {
                    demand_kategori = demand_kategori_object;
                }
            });

            if (demand_kategori == undefined) {
                return responseFormat<null>(false, 400, `Pengajuan kategori dengan id ${id} gagal ditemukan.`, null);
            } else if (demand_kategori != undefined) {
                return responseFormat<ResponseObject<DemandKategori>>(true, 200, `Pengajuan kategori dengan id ${id} berhasil ditemukan.`, {
                    demand_category: demand_kategori,
                });
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description  Get item demand object based on id
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @returns {Promise<DemandBarang>} The item demand object
     */
    public async demandGetBarangById(year: number, id: number): Promise<ResponseFormat<ResponseObject<DemandBarangWithCategoryName>>> {
        try {
            let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;
            let demand_barang: DemandBarang;

            demand_barang_data.forEach((demand_barang_object: DemandBarang) => {
                if (demand_barang_object.id == id) {
                    demand_barang = demand_barang_object;
                }
            });

            if (demand_barang == undefined) {
                return responseFormat<null>(false, 400, `Pengajuan barang dengan id ${id} gagal ditemukan.`, null);
            } else if (demand_barang != undefined) {
                let demand_barang_with_category_name: DemandBarangWithCategoryName = {
                    ...demand_barang,
                    kategori_name: (await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, demand_barang.kategori_id)).result
                        .master_category_name,
                };

                return responseFormat<ResponseObject<DemandBarangWithCategoryName>>(true, 200, `Pengajuan barang dengan id ${id} berhasil ditemukan.`, {
                    demand_item: demand_barang_with_category_name,
                });
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Filter category demand object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<DemandKategori[]>} The filtered category demand object
     */
    public async demandGetKategoriByStatus(year: number, status: number): Promise<ResponseFormat<ResponseObject<DemandKategori[]>>> {
        try {
            const status_list: number[] = [0, 1, 2];

            if (status_list.includes(status)) {
                let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

                let filtered_category_demand_data: DemandKategori[] = demand_data.kategori.filter((category_object) => {
                    if (category_object.status == status) {
                        return category_object;
                    }
                });

                return responseFormat<ResponseObject<DemandKategori[]>>(true, 200, `Pengajuan kategori dengan status ${status} berhasil ditemukan.`, {
                    demand_category: filtered_category_demand_data,
                });
            } else if (!status_list.includes(status)) {
                return responseFormat<null>(false, 400, `Status tidak valid.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Filter item demand object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<DemandBarang[]>} The filtered item demand object
     */
    public async demandGetBarangByStatus(year: number, status: number): Promise<ResponseFormat<ResponseObject<DemandBarang[]>>> {
        try {
            const status_list: number[] = [0, 1, 2];

            if (status_list.includes(status)) {
                let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;

                let filtered_item_demand_data: DemandBarang[] = demand_barang_data.filter((item_object: DemandBarang) => {
                    if (item_object.status == status) {
                        return item_object;
                    }
                });

                let demand_barang_data_with_category_name: DemandBarangWithCategoryName[] = await this.demandBarangWithCategoryName(filtered_item_demand_data);

                return responseFormat<ResponseObject<DemandBarangWithCategoryName[]>>(
                    true,
                    200,
                    `Pengajuan barang dengan status ${status} berhasil ditemukan.`,
                    {
                        demand_item: demand_barang_data_with_category_name,
                    }
                );
            } else if (!status_list.includes(status)) {
                return responseFormat<null>(false, 400, `Status tidak valid.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Create a new category object
     * @param {Number} year - The year
     * @param {String} username - The user who demands the new category object
     * @param {String} category - The new demanded category name
     * @returns {Promise<DemandKategori>} The new demanded category object
     */
    public async demandCreateKategori(year: number, category: DemandCreateKategori): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        try {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

            let new_category_demand: DemandKategori = {
                id: demand_data.kategori.length + 1,
                username: category.username,
                kategori: category.kategori,
                created_at: currentDate(),
                responded_at: null,
                status: 0,
            };

            demand_data.kategori.push(new_category_demand);

            this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

            return responseFormat<ResponseObject<DemandKategori>>(true, 201, `Pengajuan kategori berhasil dibuat.`, {
                demand_category: new_category_demand,
            });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Create a new item demand object
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {string} username - The user who demands the new item object
     * @param {String} item - The new demanded item name
     * @returns {DemandBarang} The new demanded item object
     */
    public async demandCreateBarang(year: number, item: DemandCreateBarang): Promise<ResponseFormat<ResponseObject<DemandBarang>>> {
        try {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);
            let master_data: MasterInventoryDataDocument = await this.masterInventoryService.masterFindOne(year);

            let category_id_is_valid: boolean = false;
            let category_id_is_active: boolean;
            master_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == item.kategori_id) {
                    category_id_is_valid = true;
                    category_id_is_active = category_object.active;
                }
            });

            if (category_id_is_valid) {
                if (category_id_is_active) {
                    let new_item_demand: DemandBarang = {
                        id: demand_data.barang.length + 1,
                        kategori_id: item.kategori_id,
                        username: item.username,
                        barang: item.barang,
                        satuan: item.satuan,
                        created_at: currentDate(),
                        responded_at: null,
                        status: 0,
                    };

                    demand_data.barang.push(new_item_demand);

                    this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

                    return responseFormat<ResponseObject<DemandBarang>>(true, 201, `Pengajuan barang berhasil dibuat.`, {
                        demand_item: new_item_demand,
                    });
                } else if (!category_id_is_active) {
                    return responseFormat<null>(false, 400, `Kategori dengan id ${item.kategori_id} sudah dihapus`, null);
                }
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${item.kategori_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Update status of category demand object
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @param {Number} status - The new status
     * @returns {Promise<DemandKategori>} The updated status of category demand object
     */
    public async demandResponseKategoriById(year: number, id: number, status: number): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        try {
            const demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

            let demand_category_id_is_valud: boolean = false;
            demand_data.kategori.forEach((demand_category_object: DemandKategori) => {
                if (demand_category_object.id == id) {
                    demand_category_id_is_valud = true;
                }
            });

            if (demand_category_id_is_valud) {
                const status_list: number[] = [1, 2];

                if (status_list.includes(status)) {
                    let responded_demand_kategori: DemandKategori;

                    let status_is_valid: boolean = false;
                    demand_data.kategori.forEach((demand_kategori_object: DemandKategori) => {
                        if (demand_kategori_object.id == id) {
                            if (demand_kategori_object.status == 0) {
                                demand_kategori_object.responded_at = currentDate();
                                demand_kategori_object.status = status;

                                responded_demand_kategori = demand_kategori_object;
                                status_is_valid = true;
                            }
                        }
                    });

                    if (status_is_valid) {
                        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

                        return responseFormat<ResponseObject<DemandKategori>>(true, 202, `Pengajuan kategori dengan id ${id} berhasil direspon.`, {
                            demand_category: responded_demand_kategori,
                        });
                    } else if (!status_is_valid) {
                        return responseFormat<null>(false, 400, `Pengajuan kategori dengan id ${id} sudah pernah direspon.`, null);
                    }
                } else if (!status_list.includes(status)) {
                    return responseFormat<null>(false, 400, `Status tidak valid.`, null);
                }
            } else if (!demand_category_id_is_valud) {
                return responseFormat<null>(false, 400, `Pengajuan kategori dengan id ${id} gagal ditemukan.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Update status of item demand object
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @param {Number} status - The new status
     * @returns {DemandBarang} The updated status of item demand object
     */
    public async demandResponseBarangById(year: number, id: number, status: number): Promise<ResponseFormat<ResponseObject<DemandBarang>>> {
        try {
            const demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

            let demand_item_id_is_valud: boolean = false;
            demand_data.barang.forEach((demand_item_object: DemandBarang) => {
                if (demand_item_object.id == id) {
                    demand_item_id_is_valud = true;
                }
            });

            if (demand_item_id_is_valud) {
                const status_list: number[] = [1, 2];

                if (status_list.includes(status)) {
                    let responded_demand_barang: DemandBarang;

                    let status_is_valid: boolean = false;
                    demand_data.barang.forEach((demand_barang_object: DemandBarang) => {
                        if (demand_barang_object.id == id) {
                            if (demand_barang_object.status == 0) {
                                demand_barang_object.responded_at = currentDate();
                                demand_barang_object.status = status;

                                responded_demand_barang = demand_barang_object;
                                status_is_valid = true;
                            }
                        }
                    });

                    if (status_is_valid) {
                        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

                        return responseFormat<ResponseObject<DemandBarang>>(true, 202, `Pengajuan barang dengan id ${id} berhasil direspon.`, {
                            demand_item: responded_demand_barang,
                        });
                    } else if (!status_is_valid) {
                        return responseFormat<null>(false, 400, `Pengajuan barang dengan id ${id} sudah pernah direspon.`, null);
                    }
                } else if (!status_list.includes(status)) {
                    return responseFormat<null>(false, 400, `Status tidak valid.`, null);
                }
            } else if (!demand_item_id_is_valud) {
                return responseFormat<null>(false, 400, `Pengajuan barang dengan id ${id} gagal ditemukan.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    public async demandDownloadOption() {
        const response = await pythonAxiosInstance.post("/__api/inventory/demand/update/option");

        if (response.data.success) {
            return readJSON("./scripts/json/demand_option_data.json");
        }
    }

    public async demandDownloadByUserIdAndDateId(user_id: number, date_id: number, res: any) {
        const option_data = readJSON("./scripts/json/demand_option_data.json");

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
                const response = await pythonAxiosInstance.post(`/__api/inventory/demand/download/raw/${current_date}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/demand/${username_value} ${current_date}.xlsx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Kategori dan Barang Baru ${current_date}.xlsx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (date_value != "Terbaru" && is_creatable == false) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/demand/${username_value} ${slugified_date}.xlsx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Kategori dan Barang Baru ${slugified_date}.xlsx"`,
                });

                return new StreamableFile(file);
            }
        }
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    public async demandScheduledDownload() {
        const current_date = slugifyDate(currentDate());
        const response = await pythonAxiosInstance.post(`/__api/inventory/demand/download/raw/${current_date}`);

        if (response.data.success) {
            pythonAxiosInstance.post("/__api/inventory/demand/update/option");
        }
    }
}
