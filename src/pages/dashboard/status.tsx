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

import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { NextPage } from "next";
import { Heading, Text, Stack } from "@chakra-ui/react";
import { useSubscription, eventSource$ } from "react-query-subscription";

const Status: NextPage = () => {
    const { data, isLoading } = useSubscription("events", () => eventSource$("/event"), {});

    return (
        <Sidebar>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Stack mt={4} mb={4}>
                        <Heading fontSize={`medium`} mb={6}>
                            Memory
                        </Heading>
                        <Text>Memory Usage: {(data as any).memory.rss}</Text>
                        <Text>Memory Head Total: {(data as any).memory.heapTotal}</Text>
                        <Text>Memory Head Used: {(data as any).memory.heapUsed}</Text>
                        <Text>Memory External: {(data as any).memory.external}</Text>
                    </Stack>
                    <Stack mt={4} mb={4}>
                        <Heading fontSize={`medium`} mb={6}>
                            Load Average
                        </Heading>
                        <Text>1 Minutes: {(data as any).loadAverage[0]}</Text>
                        <Text>5 Minutes: {(data as any).loadAverage[1]}</Text>
                        <Text>15 Minutes: {(data as any).loadAverage[2]}</Text>
                    </Stack>
                    <Stack mt={4} mb={4}>
                        <Heading fontSize={`medium`} mb={6}>
                            CPU Usage
                        </Heading>
                        <Text>User: {(data as any).rps.user}</Text>
                        <Text>System: {(data as any).rps.system}</Text>
                    </Stack>
                </div>
            )}
        </Sidebar>
    );
};

export default Status;
