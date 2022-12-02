import React from 'react';
import useSelector from "@src/hooks/use-selector";
import BasketModal from "@src/containers/modals/basket";
import AddToBasketModal from "@src/containers/modals/add-to-basket";
import CatalogModal from "@src/containers/modals/catalog";

function Modals() {
  const modals = useSelector(state => state.modals.isOpen);

  return (
    <>
      {modals.basket && <BasketModal/>}
      {modals.catalogModal && <CatalogModal/>}
      {modals.catalogModalBasket && <CatalogModal/>}
      {modals.addToBasket && <AddToBasketModal/>}
    </>
  );
}

export default React.memo(Modals);
