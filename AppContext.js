import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [fetchingResponse, setFetchingResponse] = useState(false);
    const [todaysChatList, setTodaysChatList] = useState([]);
    const [last7DaysChatList, setLast7DaysChatList] = useState([]);
    const [olderChatList, setOlderChatList] = useState([]);
    const [searchResult, setSearchResult] = useState([]);

    const contextValue = {
        fetchingResponse,
        setFetchingResponse,
        todaysChatList,
        setTodaysChatList,
        last7DaysChatList,
        setLast7DaysChatList,
        olderChatList,
        setOlderChatList,
        searchResult,
        setSearchResult,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
