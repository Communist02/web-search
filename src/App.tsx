import { useState } from 'react'
import './App.css'
import { App as AntApp, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { deleteSession } from './api';
import AuthPage from './auth/AuthPage';
import Search from './search/Search';

function App() {
  const [tokenAuth, setTokenAuth] = useState('');
  const [darkTheme, setDarkTheme] = useState(localStorage.getItem('darkTheme') === 'true');

  const logout = () => {
    deleteSession(tokenAuth);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setTokenAuth('');
  };

  let page = <></>;
  if (!tokenAuth) {
    page = <AuthPage authEvent={setTokenAuth} />;
  } else {
    page = <Search token={tokenAuth} onLogout={logout} />;
  }

  return (
    <ConfigProvider locale={ruRU} theme={{ algorithm: darkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <AntApp>
        {page}
      </AntApp>
    </ConfigProvider>
  )
}

export default App
