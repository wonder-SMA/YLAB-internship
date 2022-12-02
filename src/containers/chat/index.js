import React, {useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Chat from "@src/components/chat";
import * as uuid from "uuid";

function ChatContainer() {
  const store = useStore();
  const select = useSelector(state => ({
    messages: state.chat.messages,
    error: state.chat.error,
    user: state.session.user
  }));

  const callbacks = {
    // Получение старых сообщений
    getOldMessages: useCallback(() => store.get('chat').getOldMessages(), []),
    // Отправка сообщения
    sendMessage: useCallback(text => store.get('chat').sendMessage({
      author: {
        profile: {
          avatar: select.user.profile.avatar,
          name: select.user.profile.name
        },
        _id: select.user._id
      },
      dateCreate: new Date().toISOString(),
      _key: uuid.v4(),
      text,
      pending: true
    }), []),
    // Удаление всех сообщений
    deleteAllMessages: useCallback(() => store.get('chat').deleteAllMessages(), [])
  };

  return (
    <Chat
      currentUser={select.user._id}
      messages={select.messages}
      error={select.error}
      getOldMessages={callbacks.getOldMessages}
      sendMessage={callbacks.sendMessage}
      deleteAllMessages={callbacks.deleteAllMessages}
    />
  );
}

export default React.memo(ChatContainer);
