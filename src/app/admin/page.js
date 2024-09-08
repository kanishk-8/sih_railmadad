import Link from "next/link";
import { FaTrain, FaWrench, FaBuilding } from "react-icons/fa"; // Importing icons from react-icons

function AdminPortalPage() {
  return (
    <div className="min-h-screen flex items-start justify-center mt-32">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Portal</h1>

        {/* Complaint Navigation Links */}
        <div className="flex flex-col space-y-6">
          <Link href="/admin/complaints" passHref>
            <button className="flex items-center bg-red-900 hover:bg-red-700 text-white text-lg font-medium px-6 py-3 rounded-lg shadow transition duration-300 w-full">
              <FaTrain className="mr-4" /> Train Complaints Page
            </button>
          </Link>

          <Link href="/admin/stationcomplaint" passHref>
            <button className="flex items-center bg-red-900 hover:bg-red-700 text-white text-lg font-medium px-6 py-3 rounded-lg shadow transition duration-300 w-full">
              <FaBuilding className="mr-4" /> Station Complaint Page
            </button>
          </Link>

          <Link href="/admin/maintenance" passHref>
            <button className="flex items-center bg-red-900 hover:bg-red-700 text-white text-lg font-medium px-6 py-3 rounded-lg shadow transition duration-300 w-full">
              <FaWrench className="mr-4" /> Maintenance Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPortalPage;
