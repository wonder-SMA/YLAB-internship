import React, {useCallback} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";

function CatalogList() {

  const store = useStore();

  const select = useSelector(state => ({
    items: state.catalog.items,
    page: state.catalog.params.page,
    limit: state.catalog.params.limit,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.get('basket').addToBasket(_id), []),
    // Пагианция
    onPaginate: useCallback(page => store.get('catalog').setParams({page}), []),
  };

  const renders = {
    item: useCallback(item => (
      <Item item={item} onAdd={callbacks.addToBasket} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [t]),
  }

  return (
    <Spinner active={select.waiting}>
      <List items={select.items} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
    </Spinner>
  );
}

export default React.memo(CatalogList);
