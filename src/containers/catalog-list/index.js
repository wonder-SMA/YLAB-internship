import React, {useCallback, useEffect, useState} from "react";
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
  const catalog = useSelector(state => (['catalog'].concat(state.modals.withCatalog)).pop());
  const select = useSelector(state => ({
    items: state[catalog].items,
    selectedItems: state[catalog].selectedItems,
    page: state[catalog].params.page,
    paginationPage: state[catalog].paginationPage,
    limit: state[catalog].params.limit,
    count: state[catalog].count,
    waiting: state[catalog].waiting,
    withCatalog: state.modals.withCatalog
  }));
  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    setIsTop(!!select.withCatalog.length)
  }, [])

  const {t} = useTranslate();

  const callbacks = {
    // Если на главной: открытие модалки для добавления в корзину, получение результата модалки
    onAdd: useCallback(_id => {
      if (catalog === 'catalogModalBasket') {
        store.get(catalog).select(_id);
      } else {
        store.get('modals').open('addToBasket', true).then(result => store.get('basket').addToBasket(_id, result));
      }
    }, []),
    // Пагинация
    onPaginate: useCallback(page => store.get(catalog).setParams({params: {page}}), []),
    // Бесконечный скролл
    onScroll: useCallback(() => {
        store.get(catalog).setParams({params: {page: select.page + 1}, eventType: 'scroll'})
      }, [select.page]
    ),
    // Закрытие всех модалок
    closeModal: useCallback(() => store.get('modals').close('all'), []),
  };

  const renders = {
    item: useCallback(item => (
      <Item
        isModalBasket={catalog === 'catalogModalBasket'}
        item={item}
        onAdd={callbacks.onAdd}
        onLink={callbacks.closeModal}
        link={`/articles/${item._id}`}
        labelAdd={t('article.add')}
      />
    ), [t]),
  }

  return (
    <ScrollInfinite
      top={isTop}
      onChange={callbacks.onScroll}
      dataLength={select.items.length}
    >
      <Spinner active={select.waiting}>
        <List items={select.items} selectedItems={select.selectedItems} renderItem={renders.item}/>
      </Spinner>
      <Pagination
        top={isTop}
        count={select.count}
        page={select.paginationPage}
        limit={select.limit}
        onChange={callbacks.onPaginate}
      />
    </ScrollInfinite>
  );
}

export default React.memo(CatalogList);
