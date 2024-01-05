export default async function handler(req, res) {
    try {
        
    } catch (error) {
        res.status(500).json({
            message: "An error occurred when getting chats",
            error: error,
        });
    }
}