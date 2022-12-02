import React, {useCallback} from "react";
import LayoutModal from "@src/components/layouts/layout-modal";
import NumberForm from "@src/components/elements/form-number";
import useStore from "@src/hooks/use-store";

function AddToBasketModal() {
  const store = useStore();

  const callbacks = {
    // Закрытие модалки и отмена
    onClose: useCallback(() => store.get('modals').close('addToBasket'), []),
    // Закрытие модалки и OK
    onConfirm: useCallback(result => store.get('modals').close('addToBasket', result), []),
  };

  return (
    <LayoutModal title="Количество товара" labelClose="Отмена" onClose={callbacks.onClose}>
      <NumberForm onSubmit={callbacks.onConfirm} title="OK"/>
    </LayoutModal>
  )
}

export default React.memo(AddToBasketModal);
