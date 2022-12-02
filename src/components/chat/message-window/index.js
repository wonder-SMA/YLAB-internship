import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import Avatar from "@src/components/elements/avatar";
import dateTimeFormat from "@src/components/chat/utils/date-time-format";
import PropTypes from "prop-types";

function MessageWindow(props) {
  const cn = bem('MessageWindow');
  const ref = useRef();
  const [scrollHeight, setScrollHeight] = useState(0);

  useLayoutEffect(() => {
    // Делаем скролл в самый низ при первом рендере,
    // Меняем положение скролла на высоту старых сообщений после их подгрузки
    if (props.messages.length && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight - scrollHeight;
    }
  }, [props.messages[0]])

  useLayoutEffect(() => {
    // Делаем скролл в самый низ при отправке нами нового сообщения
    if (props.messages.length && ref.current && Object.keys(props.messages.at(-1)).includes('pending')) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.messages[props.messages.length - 1]])

  useEffect(() => {
    if (props.messages.length && ref.current) {
      // Запоминаем размер текущего скролла до подгрузки новых данных
      setScrollHeight(ref.current.scrollHeight);

      const observer = new IntersectionObserver(
        ([entry], observer) => {
          // проверяем что достигли первого элемента
          if (entry.isIntersecting) {
            // перестаем его отслеживать
            observer.unobserve(entry.target);
            // и загружаем новую порцию контента
            props.getOldMessages();
          }
        },
        {threshold: 0.1, root: ref.current}
      );
      // для первого потомка снова добавляем observer
      observer.observe(ref.current.childNodes[0].children[0]);
    }
  }, [props.messages[0]])

  return (
    <div className={cn()} ref={ref}>
      <ul className={cn("list")}>
        {props.messages?.map(message =>
          <li key={message._key} className={cn("message_wrapper", {mine: props.currentUser === message.author._id})}>
            <div className={cn("message")}>
              <div className={cn("message_header")}>
                <Avatar avatar={message.author.profile.avatar}/>
                <span className={cn('message_author')}>{message.author.profile.name}</span>
                <span className={cn('message_time')}>
                  {dateTimeFormat(Date.parse(message.dateCreate), 'ru')}
                </span>
                <span className={cn('message_status')}>{message.pending ? '⌛' : '✅'}</span>
              </div>
              <div className={cn("message_body")}>{message.text}</div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

MessageWindow.PropTypes = {
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
  currentUser: PropTypes.string.isRequired,
  getOldMessages: PropTypes.func
}

MessageWindow.defaultProps = {
  messages: [],
  getOldMessages: () => {}
}

export default React.memo(MessageWindow);
