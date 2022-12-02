import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import avatar from './avatar.svg';

function Avatar(props) {
  const cn = bem('Avatar');

  return (
    <div className={cn()}>
      <img src={Object.keys(props.avatar).length ? props.avatar : avatar} alt="avatar"/>
    </div>
  );
}

export default React.memo(Avatar);
