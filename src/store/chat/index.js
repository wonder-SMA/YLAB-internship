import StateModule from "@src/store/module";

/**
 * Состояние чата
 */
class ChatState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      messages: [],
      error: ''
    };
  }

  /**
   * Очистка стейта и закрытие соединения
   */
  clear() {
    this.setState({...this.initState()});
    this.services.ws.close();
  }

  /**
   * Инициализация: создание соединения, аутентификация, запрос новых сообщений если аутентификация успешна
   * @param token {string}
   * @return {Promise<boolean>}
   */
  async init(token) {
    const socket = this.services.ws.connect('/chat');
    const isAuth = await new Promise((resolve) => {
      socket.onopen = event => {
        this.getAuth(token);
        this._subscribe(socket, resolve);
      }
    });
    if (isAuth) {
      this.setState({...this.getState(), token});
      return true;
    }
    return false;
  }

  /**
   * Аутентификация
   * @param token {string}
   */
  getAuth(token) {
    console.log('getAuth');
    this.services.ws.send({
      method: 'auth',
      payload: {
        token
      }
    });
  }

  /**
   * Получение новых сообщений
   * @param fromDate {string}
   */
  getNewMessages(fromDate) {
    console.log('getNewMessages')
    this.services.ws.send({
      method: 'last',
      payload: {
        fromDate
      }
    });
  }

  /**
   * Получение старых сообщений
   */
  getOldMessages() {
    console.log('getOldMessages')
    this.services.ws.send({
      method: 'old',
      payload: {
        fromId: this.getState().messages[0]._id
      }
    });
  }

  /**
   * Удаление всех сообщений
   */
  deleteAllMessages() {
    console.log('deleteAllMessages')
    this.services.ws.send({method: 'clear'});
  }

  /**
   * Отправка сообщения
   * @param message {Object}
   */
  sendMessage(message) {
    console.log('sendMessage')
    this.setState({...this.getState(), messages: this.getState().messages.concat(message)});
    this.services.ws.send({
      method: 'post',
      payload: {
        _key: message._key,
        text: message.text
      }
    });
  }

  /**
   * Запись в стейт
   * @param data {Object}
   * @param resolve {function}
   */
  _setState(data, resolve) {
    if (data.method === 'auth') {
      if (data.payload.result) {
        resolve(true);
      } else {
        resolve(false);
        this.setState({...this.getState(), error: 'Authentication error'});
      }

    } else if (data.method === 'last') {
      const items = this.getState().messages.length ? data.payload.items.slice(1) : data.payload.items;
      this.setState({...this.getState(), messages: this.getState().messages.concat(items)});

    } else if (data.method === 'old') {
      this.setState({
        ...this.getState(),
        messages: data.payload.items.slice(0, -1).concat(this.getState().messages)
      });

    } else if (data.method === 'post') {
      let isExist = false;
      const messages = this.getState().messages.map(message => {
        if (message._key === data.payload._key) {
          isExist = true;
          message = {...message, pending: false}
        }
        return message;
      })
      isExist
        ? this.setState({...this.getState(), messages})
        : this.setState({...this.getState(), messages: this.getState().messages.concat(data.payload)});

    } else if (data.method === 'clear') {
      this.setState({...this.getState(), messages: []});
    }
  }

  /**
   * Подписка на события
   * @param socket {WebSocket}
   * @param resolve {function}
   */
  _subscribe(socket, resolve) {
    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      this._setState(data, resolve);
      console.log('Message: ', data);
    }

    socket.onerror = error => {
      console.log('Error: ', error);
    }

    socket.onclose = async event => {
      if (!event.wasClean) {
        const isAuth = await this.init(this.getState().token);
        isAuth && this.getNewMessages(this.getState().messages.at(-1).dateCreate);
      }
      console.log('Close: ', event);
    }
  }
}

export default ChatState;
