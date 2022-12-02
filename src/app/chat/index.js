import React, {useLayoutEffect} from 'react';
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import ChatContainer from "@src/containers/chat";

function Chat() {
  const store = useStore();
  const token = useSelector(state => state.session.token);

  useLayoutEffect(() => {
    // Аутентификация
    store.get('chat').init(token).then(isAuth => isAuth && store.get('chat').getNewMessages());

    return () => {
      store.get('chat').clear();
    }
  }, [])

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title="title.chat"/>
      <ToolsContainer/>
      <ChatContainer/>
    </Layout>
  );
}

export default React.memo(Chat);
