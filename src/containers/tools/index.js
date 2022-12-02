import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/navigation/menu";
import BasketSimple from "@src/components/catalog/basket-simple";
import LayoutFlex from "@src/components/layouts/layout-flex";
import useStore from "@src/hooks/use-store";

function ToolsContainer() {
  const store = useStore();
  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Открытие корзины
    onOpen: useCallback(() => store.get('modals').open('basket'), [])
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
    ]), [t]),
  }

  return (
    <LayoutFlex flex="between" indent="big">
      <Menu items={options.menu}/>
      <BasketSimple onOpen={callbacks.onOpen} amount={select.amount} sum={select.sum} t={t}/>
    </LayoutFlex>
  );
}

export default React.memo(ToolsContainer);
