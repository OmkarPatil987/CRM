import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import Snackbar from './components/common/SnackbarMessage';
import CommonDrawerComponent from './components/drawer';
import CommonDialogComponent from './components/dialog';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<AppRoute />} />
            </Routes>
            <CommonDrawerComponent />
            <CommonDialogComponent />
            <Snackbar />
        </Router>
    );
};

export default App;
