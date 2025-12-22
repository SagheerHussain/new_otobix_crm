import React, { createContext, useState, useContext } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [title, setTitle] = useState('');
    const [searchContent, setSearchContent] = useState(null);
    const [actionsContent, setActionsContent] = useState(null);

    return (
        <HeaderContext.Provider value={{ title, setTitle, searchContent, setSearchContent, actionsContent, setActionsContent }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
