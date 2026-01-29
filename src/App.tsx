import { useLocalStorage } from './hooks/useLocalStorage';
import type { User } from './types/user';
import { SignupModal } from './components/SignupModal/SignupModal';
import { MainScreen } from './components/MainScreen/MainScreen';

function App() {
  const [user] = useLocalStorage<User | null>('user', null);

  if (!user) {
    return <SignupModal />;
  }

  return <MainScreen />;
}

export default App;
