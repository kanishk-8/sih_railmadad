import Link from "next/link";

function AdminPortalPage() {
  return (
    <div className="text-red-900 h-96 text-4xl font-bold p-8 bg-white m-4 content-center items-center rounded-xl">
      <h1>Admin Portal</h1>
      <div className=" flex flex-col space-y-4 mt-8 items-center content-center">
        <Link href="/admin/complaints">
          <button className="bg-red-900 text-white px-4 py-2 rounded">
            Train Complaints Page
          </button>
        </Link>
        <Link href="/admin/stationcomplaint">
          <button className="bg-red-900 text-white px-4 py-2 rounded">
            Station Complaint Page
          </button>
        </Link>
        <Link href="/admin/maintenance">
          <button className="bg-red-900 text-white px-4 py-2 rounded">
            Maintenance Page
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AdminPortalPage;
