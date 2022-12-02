import StateModule from "@src/store/module";
import qs from '@src/utils/search-params';
import diff from "@src/utils/diff";

/**
 * Состояние каталога
 */
class CatalogState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      items: [],
      selectedItems: {},
      paginationPage: 0,
      count: 0,
      params: {
        page: 1,
        limit: 10,
        sort: 'order',
        query: '',
        category: ''
      },
      waiting: false
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из query string адреса
   * @param params
   * @return {Promise<void>}
   */
  async initParams(params = {}) {
    // Параметры из URl. Их нужно валидировать, приводить типы и брать только нужные
    const urlParams = qs.parse(window.location.search);
    let validParams = {};
    if (this.config.name === 'catalog') {
      if (urlParams.page) validParams.page = Number(urlParams.page) || 1;
      if (urlParams.limit) validParams.limit = Number(urlParams.limit) || 10;
      if (urlParams.sort) validParams.sort = urlParams.sort;
      if (urlParams.query) validParams.query = urlParams.query;
      if (urlParams.category) validParams.category = urlParams.category;
    }

    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...validParams, ...params};
    // Установка параметров и подгрузка данных
    await this.setParams({params: newParams}, true);
  }

  /**
   * Сброс параметров к начальным
   * @param params
   * @return {Promise<void>}
   */
  async resetParams(params = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...params};
    // Установка параметров и подгрузка данных
    await this.setParams({params: newParams});
  }

  /**
   * Выделение товара
   * @param _id Код товара
   */
  select(_id) {
    this.setState({
      ...this.getState(),
      selectedItems: {...this.getState().selectedItems, [_id]: !this.getState().selectedItems[_id]}
    }, 'Выделение товара');
  }

  /**
   * Установка параметров и загрузка списка товаров
   * @param params
   * @param eventType
   * @param lastPage
   * @param historyReplace {Boolean} Заменить адрес (true) или сделает новую запись в истории браузера (false)
   * @return {Promise<void>}
   */
  async setParams({params = {}, eventType = 'defaultEvent'}, historyReplace = false) {
    const amount = Math.ceil(this.getState().count / Math.max(this.getState().params.limit, 1));
    // Проверка, что запрошенная страница не превышает последнюю страницу каталога
    if (this.getState().count && (params.page > amount)) {
      if (eventType === 'scroll') {
        this.setState({
          ...this.getState(),
          paginationPage: amount
        });
      }
      return;
    }

    const newParams = {...this.getState().params, ...params};

    // Переход на первую страницу если был совершен отбор по фильтру
    if (eventType === 'filter' && this.getState().items.length > 10) newParams.page = 1;

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params: newParams,
      waiting: true,
    }, 'Смена параметров каталога');

    const apiParams = diff({
      limit: newParams.limit,
      skip: (newParams.page - 1) * newParams.limit,
      fields: 'items(*),count',
      sort: newParams.sort,
      search: {
        query: newParams.query, // search[query]=text
        category: newParams.category  // -> search[category]=id
      }
    }, {skip: 0, search: {query: '', category: ''}});

    // ?search[query]=text&search[category]=id
    const json = await this.services.api.request({
      url: `/api/v1/articles${qs.stringify(apiParams)}`
    });

    // Установка полученных данных и сброс признака загрузки
    this.setState({
      ...this.getState(),
      items: eventType === 'scroll' ? [...this.getState().items, ...json.result.items] : json.result.items,
      count: json.result.count,
      paginationPage: (eventType === 'scroll') ? newParams.page - 1 : newParams.page,
      waiting: false
    }, 'Обновление списка товара');

    // Запоминаем параметры в URL, которые отличаются от начальных
    if (this.config.name === 'catalog') {
      let queryString = qs.stringify(diff(newParams, this.initState().params));
      const url = window.location.pathname + queryString + window.location.hash;
      if (historyReplace) {
        window.history.replaceState({}, '', url);
      } else {
        window.history.pushState({}, '', url);
      }
    }
  }
}

export default CatalogState;
