import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db("Ideadb");

        const { chatId, role, content } = req.body;

        let objectId;

        try {
            objectId = new ObjectId(chatId);
        } catch (error) {
            res.status(422).json({
                message: "invalid chat ID",
            });

            return;
        }

        // validate content data
        if (!content || typeof content !== "string") {
            res.status(422).json({
                message: "content is required and must be string",
            });

            return;
        }

        // validate role
        if (role !== "user" && role !== "assistant") {
            res.status(422).json({
                message: "role must be 'user' or 'assistant'",
            });

            return;
        }

        const chat = await db.collection("chats").findOneAndUpdate(
            {
                _id: objectId,
                userId: user.sub,
            },
            {
                $push: {
                    messages: {
                        role,
                        content,
                    },
                },
            },
            {
                returnDocument: "after",
            }
        );

        res.status(200).json({
            chat: {
                ...chat.value,
                _id: chat.value._id.toString(),
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred when adding message to chats: " + error,
        });
    }
}
