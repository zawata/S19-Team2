import { createStore, applyMiddleware, compose } from 'redux'; 
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk];

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(...middleware),
    // Uncomment the following the line to use Redux Dev Tools
    // https://github.com/zalmoxisus/redux-devtools-extension
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

  )
);
export default store;