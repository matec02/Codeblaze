import React from 'react';

const UnreadMessagesContext = React.createContext({
    unreadCount: 0,
    setUnreadCount: () => {}
});

export default UnreadMessagesContext;
