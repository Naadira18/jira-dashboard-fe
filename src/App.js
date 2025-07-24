import { showErrorToast, showInfoToast, ToastNotifications } from './Components/ToastMessage/ToastMessageComponent';
import AppLayout from './Layout/AppLayout';
import './App.css';
function App() {
  return (
   <div>
    <ToastNotifications/>
    <AppLayout/>
   </div>
  );
}

export default App;
