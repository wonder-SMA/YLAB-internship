import StateModule from "@src/store/module";
import * as modules from "@src/store/exports";

/**
 * Управление модальными окнами
 */
class ModalsState extends StateModule {
  initState() {
    return {
      isOpen: {},
      result: {},
      withCatalog: []
    }
  }

  /**
   * Создание экземпляра каталога для модального окна
   * @param name {String} Название модалки
   */
  create(name) {
    // Экземпляр модуля. Передаём ему ссылку на store и название модуля.
    this.store.modules[name] = new modules['catalog'](this.store, {name, ...this.store.config.modules[name] || {}});
    // По названию модуля устанавливается свойство с начальным состоянием от модуля
    this.store.state[name] = this.store.modules[name].initState();
    this.setState({
      ...this.getState(),
      withCatalog: [...this.getState().withCatalog, name]
    });
  }

  /**
   * Открытие модального окна по названию
   * @param name {String} Название модалки
   * @param promise {Boolean} Возвращать ли промис
   */
  open(name, promise) {
    this.setState({
      ...this.getState(),
      isOpen: {...this.getState().isOpen, [name]: true}
    }, `Открытие модалки ${name}`);

    if (promise) {
      const bindState = this.getState.bind(this);
      return new Promise((resolve) => {
        window.addEventListener('submit', function handler(e) {
          document.removeEventListener('submit', handler);
          e.preventDefault();
          resolve(bindState().result[name]);
        })
      })
    }
  }

  /**
   * Закрытие модального окна по названию
   * @param name {String} Название модалки
   * @param result {any} Результат из модалки
   */
  close(name, result) {
    const isContain = this.getState().withCatalog.includes(name);
    const isAll = name === 'all';
    this.setState({
      ...this.getState(),
      isOpen: isAll ? {} : {...this.getState().isOpen, [name]: false},
      result: isAll ? {} : {...this.getState().result, [name]: result},
      withCatalog: isAll ? [] : (isContain ? [...this.getState().withCatalog.slice(0, -1)] : [...this.getState().withCatalog])
    }, `Закрытие модалки ${name}`);
  }
}

export default ModalsState;
