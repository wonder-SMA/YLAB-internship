import React from 'react';
import {useSelector as useSelectorRedux} from 'react-redux'
import {Routes, Route} from "react-router-dom";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import Protected from "@src/containers/protected";
import Main from "./main";
import Basket from "./basket";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";

/**
 * Приложение
 * @return {React.ReactElement} Виртуальные элементы React
 */
function App() {

  const store = useStore();

  useInit(async ()=>{
    await store.get('session').remind();
  })

  //const modal = useSelector(state => state.modals.name);
  const modal = useSelectorRedux(state => state.modals.name);

  return (
    <>
      <Routes>
        <Route path={''} element={<Main/>}/>
        <Route path={"/articles/:id"} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect={'/login'}><Profile/></Protected>}/>
      </Routes>
      {modal === 'basket' && <Basket/>}
    </>
  );
}

export default React.memo(App);
