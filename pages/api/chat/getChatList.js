import clientPromise from "@/lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db("Ideadb");

        // the line below should not be uncommented unless you want to reset db
        // await db.collection("chats").deleteMany({});

        const chats = await db
            .collection("chats")
            .find(
                {
                    userId: user.sub,
                },
                {
                    projection: {
                        userId: 0,
                        messages: 0,
                    },
                }
            )
            .sort({
                _id: -1,
            })
            .toArray();

        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred when getting chats",
            error: error,
        });
    }
}
