import { FirmhouseClient } from "@firmhouse/firmhouse";

export const firmhouseClient = new FirmhouseClient({
    apiToken: process.env.NEXT_PUBLIC_PROJECT_ACCESS_TOKEN ?? '',
});

