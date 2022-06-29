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
 * @fileoverview The inventory demand manage create item page.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { NextPage } from "next";
import { Stack, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { fetch } from "@/shared/utils/fetch";

export interface InventoryMasterUpdateDependencyParameter {
    semester: number;
    tanggal_awal: number;
    bulan_awal: number;
    tahun_awal: number;
    tanggal_akhir: number;
    bulan_akhir: number;
    tahun_akhir: number;
    pengurus_barang_pengguna: string;
    kasubag_program_dan_keuangan: string;
    plt_kasubag_umum: string;
    sekretaris_dinas: string;
    kepala_dinas_ketenagakerjaan: string;
}

export class InventoryMasterUpdateDependencyValidationModel extends FormikValidatorBase implements InventoryMasterUpdateDependencyParameter {
    @IsNotEmpty({ message: "" })
    semester: number;

    @IsNotEmpty({ message: "" })
    tanggal_awal: number;

    @IsNotEmpty({ message: "" })
    bulan_awal: number;

    @IsNotEmpty({ message: "" })
    tahun_awal: number;

    @IsNotEmpty({ message: "" })
    tanggal_akhir: number;

    @IsNotEmpty({ message: "" })
    bulan_akhir: number;

    @IsNotEmpty({ message: "" })
    tahun_akhir: number;

    @IsNotEmpty({ message: "" })
    pengurus_barang_pengguna: string;

    @IsNotEmpty({ message: "" })
    kasubag_program_dan_keuangan: string;

    @IsNotEmpty({ message: "" })
    plt_kasubag_umum: string;

    @IsNotEmpty({ message: "" })
    sekretaris_dinas: string;

    @IsNotEmpty({ message: "" })
    kepala_dinas_ketenagakerjaan: string;

    constructor(isUpdate: boolean, data: InventoryMasterUpdateDependencyParameter) {
        super();

        if (isUpdate) {
            this.semester = data.semester;
            this.tanggal_awal = data.tanggal_awal;
            this.bulan_awal = data.bulan_awal;
            this.tahun_awal = data.tahun_awal;
            this.tanggal_akhir = data.tanggal_akhir;
            this.bulan_akhir = data.bulan_akhir;
            this.tahun_akhir = data.tahun_akhir;
            this.pengurus_barang_pengguna = data.pengurus_barang_pengguna;
            this.kasubag_program_dan_keuangan = data.kasubag_program_dan_keuangan;
            this.plt_kasubag_umum = data.plt_kasubag_umum;
            this.sekretaris_dinas = data.sekretaris_dinas;
            this.kepala_dinas_ketenagakerjaan = data.kepala_dinas_ketenagakerjaan;
        }
    }
}

type PageQuery = {};

export interface MasterDependency extends InventoryMasterUpdateDependencyParameter {}

type PageProps = {
    payload: MasterDependency;
};

const InventoryMasterManageUpdateDependency: NextPage<PageProps> = ({ payload }) => {
    const toast = useToast();

    const InventoryMasterManageCreateCategorySubmit = (
        values: InventoryMasterUpdateDependencyValidationModel,
        actions: FormikHelpers<InventoryMasterUpdateDependencyValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryMasterUpdateDependencyParameter = {
            semester: parseInt(values.semester as unknown as string),
            tanggal_awal: parseInt(values.tanggal_awal as unknown as string),
            bulan_awal: parseInt(values.bulan_awal as unknown as string),
            tahun_awal: parseInt(values.tahun_awal as unknown as string),
            tanggal_akhir: parseInt(values.tanggal_akhir as unknown as string),
            bulan_akhir: parseInt(values.bulan_akhir as unknown as string),
            tahun_akhir: parseInt(values.tahun_akhir as unknown as string),
            pengurus_barang_pengguna: values.pengurus_barang_pengguna,
            kasubag_program_dan_keuangan: values.kasubag_program_dan_keuangan,
            plt_kasubag_umum: values.plt_kasubag_umum,
            sekretaris_dinas: values.sekretaris_dinas,
            kepala_dinas_ketenagakerjaan: values.kepala_dinas_ketenagakerjaan,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post(`__api/data/inventory/master/update/dependency`, payload)
                    .then((response) => {
                        if (response.data.success) {
                            toast({
                                title: "Excel text berhasil diperbarui!",
                                status: "success",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });

                            actions.setSubmitting(false);
                            resolve();
                        } else if (!response.data.success) {
                            toast({
                                title: "Excel text gagal diperbarui!",
                                description: response.data.message,
                                status: "error",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });

                            actions.setSubmitting(false);
                            resolve();
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        toast({
                            title: "Excel text gagal diperbarui!",
                            status: "error",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });

                        actions.setSubmitting(false);
                        resolve();
                    });
            }, 1000);
        });
    };

    return (
        <Sidebar type="inventory">
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Inventaris: Perbarui Excel Text</Heading>
                <Formik
                    initialValues={new InventoryMasterUpdateDependencyValidationModel(true, payload)}
                    validate={InventoryMasterUpdateDependencyValidationModel.createValidator()}
                    onSubmit={InventoryMasterManageCreateCategorySubmit}
                >
                    {(props: FormikProps<InventoryMasterUpdateDependencyValidationModel>) => (
                        <Form>
                            <Field name="semester">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="semester" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Semester
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama semester disini.." />
                                        <FormErrorMessage>{form.errors.semester}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="tanggal_awal">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="tanggal_awal" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Tanggal Awal
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama tanggal awal disini.." />
                                        <FormErrorMessage>{form.errors.tanggal_awal}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="bulan_awal">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="bulan_awal" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Bulan Awal
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama bulan awal disini.." />
                                        <FormErrorMessage>{form.errors.bulan_awal}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="tahun_awal">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="tahun_awal" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Tahun Awal
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama tahun awal disini.." />
                                        <FormErrorMessage>{form.errors.tahun_awal}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="tanggal_akhir">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="tanggal_akhir" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Tanggal Akhir
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama tanggal akhir disini.." />
                                        <FormErrorMessage>{form.errors.tanggal_akhir}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="bulan_akhir">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="bulan_akhir" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Bulan Akhir
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama bulan akhir disini.." />
                                        <FormErrorMessage>{form.errors.bulan_akhir}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="tahun_akhir">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="tahun_akhir" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Tahun Akhir
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama tahun akhir disini.." />
                                        <FormErrorMessage>{form.errors.tahun_akhir}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="pengurus_barang_pengguna">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="pengurus_barang_pengguna" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Pengurus Barang Pengguna
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama pengurus barang pengguna disini.." />
                                        <FormErrorMessage>{form.errors.pengurus_barang_pengguna}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="kasubag_program_dan_keuangan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="kasubag_program_dan_keuangan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kasubag Program Dan Keuangan
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            disabled={props.isSubmitting}
                                            id="kategori"
                                            placeholder="Nama kasubag program dan keuangan disini.."
                                        />
                                        <FormErrorMessage>{form.errors.kasubag_program_dan_keuangan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="plt_kasubag_umum">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="plt_kasubag_umum" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kasubag Umum
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama kasubag umum disini.." />
                                        <FormErrorMessage>{form.errors.plt_kasubag_umum}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="sekretaris_dinas">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel htmlFor="sekretaris_dinas" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Sekretaris Dinas
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama sekretaris dinas disini.." />
                                        <FormErrorMessage>{form.errors.sekretaris_dinas}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="kepala_dinas_ketenagakerjaan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterUpdateDependencyParameter> }) => (
                                    <FormControl my={2}>
                                        <FormLabel
                                            htmlFor="kepala_dinas_ketenagakerjaankepala_dinas_ketenagakerjaan"
                                            fontWeight={`medium`}
                                            color={`blackAlpha.700`}
                                        >
                                            Kepala Dinas Ketenegakerjaan
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            disabled={props.isSubmitting}
                                            id="kategori"
                                            placeholder="Nama kepala dinas ketenegakerjaan disini.."
                                        />
                                        <FormErrorMessage>{form.errors.kepala_dinas_ketenagakerjaan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Button mt={8} colorScheme="teal" isLoading={props.isSubmitting} disabled={props.isSubmitting} type="submit">
                                Kirimkan
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Sidebar>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps, PageQuery>(async (ctx) => {
    const response = await fetch(`/__api/inventory/master/get/dependency`, {}, false, true);

    if (response.success == true) {
        return {
            payload: response.result.dependencyData,
        };
    }
});

export default InventoryMasterManageUpdateDependency;
