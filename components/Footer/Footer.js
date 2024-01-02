import { useState } from "react";

export const Footer = () => {
    const [messageText, setMessageText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("MESSAGE TEXT - ", messageText);
    };

    return (
        <div className="bg-slate-300 p-10">
            {/* bg-gray-800 */}
            <form onSubmit={handleSubmit}>
                <fieldset className="flex gap-3">
                    <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Enter an idea..."
                        className="textarea w-full"
                    />
                    <button type="submit" className="btn">
                        Send
                    </button>
                </fieldset>
            </form>
        </div>
    );
};
