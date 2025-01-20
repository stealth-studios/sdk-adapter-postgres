import {
    pgTable,
    timestamp,
    text,
    integer,
    foreignKey,
    serial,
    uniqueIndex,
    jsonb,
    uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const conversation = pgTable(
    "Conversation",
    {
        id: serial().primaryKey().notNull(),
        secret: uuid("secret").defaultRandom().notNull(),
        persistenceToken: text(),
        data: jsonb(),
        characterHash: text().notNull(),
        createdAt: timestamp({ precision: 3, mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.characterHash],
            foreignColumns: [character.hash],
            name: "Conversation_characterHash_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    ],
);

export const player = pgTable(
    "Player",
    {
        id: text().primaryKey().notNull(),
        name: text().notNull(),
        conversationId: integer(),
        createdAt: timestamp({ precision: 3, mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.conversationId],
            foreignColumns: [conversation.id],
            name: "Player_conversationId_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
    ],
);

export const character = pgTable(
    "Character",
    {
        hash: text().primaryKey().notNull(),
        name: text().notNull(),
        data: jsonb().notNull(),
        createdAt: timestamp({ precision: 3, mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    },
    (table) => [
        uniqueIndex("Character_hash_key").using(
            "btree",
            table.hash.asc().nullsLast().op("text_ops"),
        ),
    ],
);

export const message = pgTable(
    "Message",
    {
        id: serial().primaryKey().notNull(),
        content: text().notNull(),
        role: text().notNull(),
        senderId: text(),
        conversationId: integer().notNull(),
        context: jsonb()
            .notNull()
            .$type<
                {
                    key: string;
                    value: string;
                }[]
            >()
            .default([]),
        createdAt: timestamp({ precision: 3, mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.senderId],
            foreignColumns: [player.id],
            name: "Message_senderId_fkey",
        })
            .onUpdate("cascade")
            .onDelete("set null"),
        foreignKey({
            columns: [table.conversationId],
            foreignColumns: [conversation.id],
            name: "Message_conversationId_fkey",
        })
            .onUpdate("cascade")
            .onDelete("cascade"),
    ],
);
