import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import MessageWindow from "@src/components/chat/message-window";
import NewComment from "@src/components/chat/new-comment";
import PropTypes from "prop-types";

function Chat(props) {
  const cn = bem('Chat');

  return (
    <div className={cn()}>
      <div className={cn('error')}>{props.error}</div>
      <MessageWindow
        messages={props.messages}
        currentUser={props.currentUser}
        getOldMessages={props.getOldMessages}
      />
      <NewComment
        sendMessage={props.sendMessage}
        deleteAllMessages={props.deleteAllMessages}
      />
    </div>
  );
}

Chat.PropTypes = {
  currentUser: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    author: {
      profile: {
        avatar: PropTypes.string,
        name: PropTypes.string.isRequired
      },
      _id: PropTypes.string.isRequired
    },
    dateCreate: PropTypes.instanceOf(Date),
    _key: PropTypes.string.isRequired,
    text: PropTypes.string,
    pending: PropTypes.bool.isRequired
  })),
  error: PropTypes.string,
  getOldMessages: PropTypes.func,
  sendMessage: PropTypes.func,
  deleteAllMessages: PropTypes.func
}

Chat.defaultProps = {
  messages: [],
  getOldMessages: () => {},
  sendMessage: () => {},
  deleteAllMessages: () => {}
}

export default React.memo(Chat);
