import { FormControl, FormLabel, Input, Button, Box, List, ListItem, Text, Stack } from "@chakra-ui/react";
import Downshift from "downshift";

const items = [{ value: "apple" }, { value: "pear" }, { value: "orange" }, { value: "grape" }, { value: "banana" }];

export const InputAutoComplete = () => {
    return (
        <Downshift
            onChange={(selection) => alert(selection ? `You selected ${selection.value}` : "Selection Cleared")}
            itemToString={(item) => (item ? item.value : "")}
        >
            {({ getInputProps, getItemProps, getMenuProps, getLabelProps, getToggleButtonProps, inputValue, isOpen, getRootProps }) => (
                <FormControl mb={4}>
                    <FormLabel {...getLabelProps()} fontWeight={`medium`} color={`blackAlpha.700`}>
                        Username
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
                            {isOpen &&
                                items
                                    .filter((item) => !inputValue || item.value.includes(inputValue))
                                    .map((item, index) => (
                                        <ListItem
                                            borderTop="1px solid rgba(0,0,0,0.1)"
                                            borderBottom="1px solid rgba(0,0,0,0.1)"
                                            {...getItemProps({
                                                key: `${item.value}${index}`,
                                                item,
                                                index,
                                            })}
                                        >
                                            <Text padding={2}> {item.value}</Text>
                                        </ListItem>
                                    ))}
                        </List>
                    </Box>
                </FormControl>
            )}
        </Downshift>
    );
};
