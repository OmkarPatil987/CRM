import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from './providers/ReduxProvider';
import ThemeProviders from './providers/ThemeProvider';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ReduxProvider>
        <ThemeProviders>
            <App />
        </ThemeProviders>
    </ReduxProvider>
);

reportWebVitals();
