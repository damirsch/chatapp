import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import Store, { setupStore } from './store/store';
import { Provider } from 'react-redux';
import App from './App';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
)

interface State{
	store: Store
}

const store2 = setupStore()
const store = new Store()

export const Context = createContext<State>({
	store
})

root.render(
	<Provider store={store2}> 
		<Context.Provider value={{store}}>
			<App />
		</Context.Provider>
	</Provider>
)