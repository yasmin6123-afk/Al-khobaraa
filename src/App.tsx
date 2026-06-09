import Navbar from './components/navbar';
import Hero from './components/hero';
import Footer from './components/footer';

function App() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
