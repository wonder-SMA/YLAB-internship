/**
 * Настройки сервисов
 */
const config ={
  store: {
    log: false,

    modules: {
      session: {
        tokenHeader: 'X-Token'
      }
    }
  },

  api: {
    baseUrl: ''
  },

  ws: {
    baseUrl: 'ws://example.front.ylab.io'
  }
}

export default config;
