import { Outlet, useNavigation } from 'react-router-dom';
import CartOverview from '../features/cart/CartOverview';
import Header from './Header';
import Loader from './Loader';

function AppLayout() {
  const navigation = useNavigation(); // it return a loading/idle state by using which we can place a loader to tell if data being fetched
  const isLoading = navigation.state === 'loading';

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      {isLoading && <Loader />}

      <Header />
      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          <Outlet /> {/* For accessing children routes within AppLayout */}
        </main>
      </div>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
