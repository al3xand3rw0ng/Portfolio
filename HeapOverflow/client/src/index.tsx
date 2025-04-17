import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import HeapOverflow from './components/heapoverflow';
import { FakeSOSocket } from './types';
import theme from './theme';
import FontContext from './FontContext';
import BlackAndWhiteContext from './BlackAndWhiteContext';

const container = document.getElementById('root');

const App = () => {
  const [socket, setSocket] = useState<FakeSOSocket | null>(null);
  const [fontSize, setFontSize] = useState('md');
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  const handleToggleFont = () => {
    setFontSize(prevFontSize => {
      let nextFontSize;
      switch (prevFontSize) {
        case 'sm':
          nextFontSize = 'md';
          break;
        case 'md':
          nextFontSize = 'lg';
          break;
        case 'lg':
          nextFontSize = 'xl';
          break;
        default:
          nextFontSize = 'sm';
      }
      return nextFontSize;
    });
  };

  const resetFont = () => {
    setFontSize('md'); // Reset font size to default
  };

  const handleToggleBlackAndWhite = () => {
    setIsBlackAndWhite(!isBlackAndWhite);
  };

  const resetBlackAndWhite = () => {
    setIsBlackAndWhite(false); // Reset to default (non-B&W mode)
  };

  const serverURL = process.env.REACT_APP_SERVER_URL;

  if (serverURL === undefined) {
    throw new Error("Environment variable 'REACT_APP_SERVER_URL' must be defined");
  }

  useEffect(() => {
    if (!socket) {
      setSocket(io(serverURL));
    }

    return () => {
      if (socket !== null) {
        socket.disconnect();
      }
    };
  }, [socket, serverURL]);

  return (
    <FontContext.Provider value={{ fontSize, handleToggleFont, resetFont, setFontSize }}>
      <BlackAndWhiteContext.Provider
        value={{
          isBlackAndWhite,
          handleToggleBlackAndWhite,
          resetBlackAndWhite,
          setBlackAndWhite(newValue) {
            // Updated parameter to avoid shadowing
            setIsBlackAndWhite(newValue); // Use newValue for the update
          },
        }}>
        <ChakraProvider theme={theme}>
          <Router>
            <HeapOverflow socket={socket} />
          </Router>
        </ChakraProvider>
      </BlackAndWhiteContext.Provider>
    </FontContext.Provider>
  );
};

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
