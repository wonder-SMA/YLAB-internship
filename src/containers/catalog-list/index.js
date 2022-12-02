import React, {useCallback} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import ScrollInfinite from "@src/components/navigation/scroll-infinite";

function CatalogList() {

  const store = useStore();

  const select = useSelector(state => ({
    items: state.catalog.items,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
    lastPage: state.catalog.lastPage
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.get('basket').addToBasket(_id), []),
    // Пагинация
    onPaginate: useCallback((page, lastPage) => {
      if (!page && lastPage) {
        store.get('catalog').setLastPage(lastPage);
      } else if (page) {
        store.get('catalog').setParams({params: {page}, eventType: 'click'})
      }
    }, []),
    // Бесконечный скролл
    onScroll: useCallback(() => store.get('catalog').setParams(
        {
          params: {page: select.page + 1},
          eventType: 'scroll'
        }
      ), [select.page, select.lastPage]
    ),
  };

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [t]),
  }

  return (
    <ScrollInfinite
      onChange={callbacks.onScroll}
      dataLength={select.items.length}
      isLastPage={select.page === select.lastPage || !select.lastPage}
    >
      <Spinner active={select.waiting}>
        <List items={select.items} renderItem={renders.item}/>
        <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
      </Spinner>
    </ScrollInfinite>
  );
}

export default React.memo(CatalogList);
