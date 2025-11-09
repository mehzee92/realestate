import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-lg mt-4">You do not have permission to view this page.</p>
      <Link href="/" className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Go to Homepage
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
