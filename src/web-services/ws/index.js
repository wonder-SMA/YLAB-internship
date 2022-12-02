class WSService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services;
    this.config = {...config}
  }

  /**
   * Создание сокета
   * @param url
   * @return {Object}
   */
  connect(url) {
    if (!url.match(/^(ws|wss|\/\/)/)) url = this.config.baseUrl + url;
    return this.socket = new WebSocket(url);
  }

  /**
   * Метод WebSocket send
   * @param method
   * @param payload
   */
  send({method, payload = {}}) {
    this.socket.send(JSON.stringify({
      method,
      payload
    }));
  }

  /**
   * Метод WebSocket close
   */
  close() {
    this.socket.close();
  }
}

export default WSService;
