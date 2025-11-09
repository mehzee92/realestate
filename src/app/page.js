import ClientSearchAndFilters from '../components/home-search/ClientSearchAndFilters';
import PropertiesListings from '../components/home-search/PropertiesListings';

export default function Home() {
  return (
    <div className='bg-[#f7f7f7] min-h-screen mt-20'>
      <ClientSearchAndFilters />
      <PropertiesListings />
    </div>
  );
}