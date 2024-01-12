import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db("Ideadb");

        const { chatId } = req.body;

        const chat = await db.collection("chats").findOne({
            userId: user.sub,
            _id: new ObjectId(chatId),
        });

        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }

        const messages = chat.messages || [];
        const messagesWithId = messages.map((message) => ({
            ...message,
            _id: uuid(),
        }));

        res.status(200).json({ messages: messagesWithId });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred when getting chat",
            error: error,
        });
    }
}
