import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const { message } = req.body;

        // validate message data
        if (!message || typeof message !== "string" || message.length > 250) {
            res.status(422).json({
                message:
                    "message is required and must be less than 200 characters",
            });

            return;
        }

        const newUserMessage = {
            role: "user",
            content: message,
        };

        const client = await clientPromise;
        const db = client.db("Ideadb");

        const chat = await db.collection("chats").insertOne({
            userId: user.sub,
            messages: [newUserMessage],
            title: message,
            time: new Date(),
        });
        res.status(200).json({
            _id: chat.insertedId.toString(),
            messages: [newUserMessage],
            title: message,
        });
    } catch (error) {
        console.log("error in create new chat - ", error);

        res.status(500).json({
            message: "An error occurred when creating a new chat",
        });
    }
}
