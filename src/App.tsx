import { useCurrentDeck } from './store/AppContext';
import { DeckList } from './components/DeckList';
import { DeckView } from './components/DeckView';

function App() {
  const currentDeck = useCurrentDeck();

  return (
    <div className="min-h-screen">
      {currentDeck ? <DeckView /> : <DeckList />}
    </div>
  );
}

export default App;
