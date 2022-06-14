import { axiosInstance } from "@/shared/utils/axiosInstance";
import { FormControl, FormLabel, Input, Button, Box, List, ListItem, Text, Stack } from "@chakra-ui/react";
import Downshift from "downshift";
import { useQuery, UseQueryResult } from "react-query";
import { matchSorter } from "match-sorter";

const fetchInventoryBarangAll = async (): Promise<any> => {
    const response = await axiosInstance.get("__api/data/inventory/master/search/barang/all");
    return response.data;
};
export const useInventoryBarangAll = () => useQuery(["inventory-barang-all"], () => fetchInventoryBarangAll());

const items = [{ value: "apple" }, { value: "pear" }, { value: "orange" }, { value: "grape" }, { value: "banana" }];

export const InputAutoComplete = ({ formikFields }: { formikFields: any }) => {
    let items_query: UseQueryResult<any[], unknown> = useInventoryBarangAll();
    let values: { value: string; item_name: string; category_name: string }[] = [];

    if (!items_query.isLoading) {
        items_query.data.map((item) => {
            values.push({
                value: `${item.item_name} - ${item.category_name}`,
                item_name: item.item_name,
                category_name: item.category_name,
            });
        });
    }

    return (
        <Downshift
            onChange={(selection) => alert(selection ? `You selected ${selection.value}` : "Selection Cleared")}
            itemToString={(item) => (item ? item.value : "")}
        >
            {({ getInputProps, getItemProps, getMenuProps, getLabelProps, getToggleButtonProps, inputValue, isOpen, getRootProps }) => (
                <FormControl mb={4}>
                    <FormLabel {...getLabelProps()} fontWeight={`medium`} color={`blackAlpha.700`}>
                        Search
                    </FormLabel>
                    <Stack
                        direction="row"
                        {...getRootProps(
                            {
                                refKey: "",
                            },
                            { suppressRefError: true }
                        )}
                    >
                        <Input {...getInputProps()} />
                        <Button {...getToggleButtonProps()} aria-label={"toggle menu"}>
                            &#8595;
                        </Button>
                    </Stack>
                    <Box pb={4} mb={4}>
                        <List {...getMenuProps()} bg="white">
                            {items_query.isLoading ? (
                                <ListItem marginTop={2} borderTop="1px solid rgba(0,0,0,0.1)" borderBottom="1px solid rgba(0,0,0,0.1)">
                                    <Text padding={2}>Loading</Text>
                                </ListItem>
                            ) : (
                                isOpen &&
                                matchSorter(values, inputValue, {
                                    keys: ["value"],
                                }).map((item, index) => (
                                    <ListItem
                                        key={index}
                                        {...getItemProps({ item })}
                                        borderTop="1px solid rgba(0,0,0,0.1)"
                                        borderBottom="1px solid rgba(0,0,0,0.1)"
                                    >
                                        <Text padding={2}>{item.value}</Text>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Box>
                </FormControl>
            )}
        </Downshift>
    );
};
