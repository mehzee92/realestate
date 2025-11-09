import Image from 'next/image';
import { FiPhone, FiMail } from 'react-icons/fi';
import Button from '@/components/uis/Button';
import H2 from '@/components/uis/h2';
import P from '@/components/uis/P';
import { useState } from 'react';
import ContactAgentModal from '@/components/contact/ContactAgentModal';

const AgentInfo = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const agent = {
    name: 'Max',
    phone: '+16308911111',
    telegram: '@Makselis',
    email: 'max@buyin.miami',
    avatar: '/images/logo2.png',
  };

  return (
    <div className="lg:w-80">
      <div className="bg-white shadow-md p-6 left-0 fixed w-full z-30 bottom-0 h-20 md:h-auto md:sticky md:top-[100px] rounded-xl border border-gray-200">
        {/* Agent Header */}
        <div className=" items-center gap-2 mb-6 hidden md:flex">
          <div className="relative w-15 h-15 mb-4">
            <Image
              src={agent.avatar}
              alt={agent.name}
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-full object-cover border border-gray-300"
            />
          </div>
          <div>
            <H2 text={agent.name} className="text-md font-bold text-gray-900" />
            <P text="Real Estate Broker" className="text-md text-gray-400" />
          </div>

        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6 hidden md:block">
          {agent.phone && (
            <div className="flex justify-between items-center text-base font-semibold border-b border-gray-300 py-3 space-x-3">
              <p  className="text-gray-500">
                Phone Number
              </p>
              <a href={`tel:${agent.phone}`} className="text-gray-800 hover:text-blue-600">
                {agent.phone}
              </a>
            </div>
          )}
          {agent.email && (
            <div className="flex items-center text-base font-semibold justify-between space-x-3">
              <p className="text-gray-500" >
                Email
              </p>
              <a href={`mailto:${agent.email}`} className="text-gray-800 hover:text-blue-600">
                {agent.email}
              </a>
            </div>
          )}
          {agent.telegram && (
            <div className="flex items-center text-base font-semibold justify-between py-3 border-b border-gray-300 space-x-3">
              <p className="text-gray-500" >
                Telegram
              </p>
              <a href={`https://t.me/${agent.telegram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-blue-600">
                {agent.telegram}
              </a>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button onClick={() => setIsModalOpen(true)} className="w-[90%] m-auto md:w-full">
          Contact Agent
        </Button>
        <ContactAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyAddress={property.address} />
      </div>
    </div>
  );
};

export default AgentInfo;