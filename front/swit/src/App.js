

//import logo from './logo.svg';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import root from './router/root';
import LoginContextProvider from './contexts/LoginContextProvider';

function App() {
  return (
    <LoginContextProvider>
      <RouterProvider router={root}/>
    </LoginContextProvider>
  );
}

export default App;
