import React, {useCallback, useState} from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import PropTypes from "prop-types";

function NewComment(props) {
  const cn = bem('NewComment');
  const [text, setText] = useState('');

  const callbacks = {
    onChange: useCallback(e => {
      setText(e.target.value);
    }, []),
    sendMessage: useCallback(e => {
      e.preventDefault();
      if (text.trim()) {
        props.sendMessage(text);
        setText('');
      }
    }, [text]),
    deleteText: useCallback(() => setText(''), []),
    deleteAllMessages: useCallback(() => props.deleteAllMessages(), [])
  }

  return (
    <div className={cn()}>
      <form onSubmit={callbacks.sendMessage}>
        <textarea
          className={cn('input')}
          value={text}
          placeholder={props.placeholder}
          onChange={callbacks.onChange}
        />
        <div className={cn('buttons')}>
          <button className={cn('delete')} onClick={callbacks.deleteText}>Удалить текст</button>
          <button className={cn('send')} type="submit">Отправить</button>
          <button className={cn('delete-all')} onClick={callbacks.deleteAllMessages}>Удалить все</button>
        </div>
      </form>
    </div>
  );
}

NewComment.PropTypes = {
  placeholder: PropTypes.string,
  sendMessage: PropTypes.func,
  deleteAllMessages: PropTypes.func
}

NewComment.defaultProps = {
  placeholder: "Написать сообщение...",
  sendMessage: () => {},
  deleteAllMessages: () => {}
}

export default React.memo(NewComment);
