import Headings from '../../uis/Headings'; // Corrected import
import Button from '../../uis/Button';
import P from '@/components/uis/P';

const Overview = ({ fullDescription, truncatedDescription, showFullDescription, setShowFullDescription, property }) => (
  <div className=" border-b border-gray-100">
    <Headings text="Overview" className="text-2xl font-bold text-gray-900 mb-4" /> {/* Corrected usage */}
    
  

    {/* Property Description */}
    <P text={showFullDescription ? fullDescription : truncatedDescription}/> {/* Changed to p tag */}
     

    {/* Read more button */}
    <Button 
    text={showFullDescription ? 'Read less' : 'Read more'}
      onClick={() => setShowFullDescription(!showFullDescription)}
      className='mb-4'
    >
      {showFullDescription ? 'Read less' : 'Read more'}
    </Button>
  </div>
);

export default Overview;