import { drizzle } from "drizzle-orm/node-postgres";
export default function (url: string) {
    if (!url) {
        throw new Error("Database URL was not passed!");
    }

    const db = drizzle(url);
    return db;
}
