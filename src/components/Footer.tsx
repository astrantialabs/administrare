import { Box, Flex, Container, Text, Link } from "@chakra-ui/react";

export default function Footer() {
    const currentDate = new Date();
    return (
        <Box>
            <Flex minHeight="80px" py={2} px={2} align="center">
                <Container maxWidth="1130px">
                    <Flex justify={{ base: "center", md: "center" }}>
                        <Text textAlign={{ base: "center", md: "center" }} fontFamily="heading" fontSize={{ base: "sm", md: "md" }}>
                            Di kembangkan oleh <Link href="https://github.com/yehezkieldio">Yehezkiel Dio</Link> dan{" "}
                            <Link href="https://github.com/NotHydra">Rizky Irswanda</Link>
                        </Text>
                    </Flex>
                </Container>
            </Flex>
        </Box>
    );
}
