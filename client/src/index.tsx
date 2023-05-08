import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './forServer/store/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

interface State{
  store: Store
}

const store = new Store()

export const Context = createContext<State>({
  store
})

root.render(
  <Context.Provider value={{store}}>
    <App />
  </Context.Provider>
)