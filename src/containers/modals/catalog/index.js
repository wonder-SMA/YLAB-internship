import React, {useCallback, useEffect} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import LayoutModal from "@src/components/layouts/layout-modal";

function CatalogModal() {
  const store = useStore();
  const catalog = useSelector(state => (['catalog'].concat(state.modals.withCatalog)).pop());
  const select = useSelector(state => ({selectedItems: state[catalog].selectedItems}));

  useEffect(() => {
    store.get(catalog).initParams();
  }, []);

  // Закрытие модалки
  const onClose = useCallback(async () => {
    store.get('modals').close(catalog);
    if (catalog === 'catalogModalBasket' && Object.keys(select.selectedItems).length) {
      store.get('basket').addSelectedToBasket(select.selectedItems);
    }
  }, [select.selectedItems])

  return (
    <LayoutModal title="Модальное окно каталога" onClose={onClose}>
      <CatalogFilter/>
      <CatalogList/>
    </LayoutModal>
  )
}

export default React.memo(CatalogModal);
