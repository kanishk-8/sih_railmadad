import Footer from "@/components/Footer";
import Link from "next/link";

function AdminPortalPage() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image.png')" }}
    >
      {/* Acrylic Effect */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm">
        {/* Content */}
        <div className="text-red-900 text-4xl font-bold p-8">
          <h1>Admin Portal</h1>
          <nav>
            <ul className="space-y-4 mt-8">
              <li>
                <Link href="/admin/complaints">
                  Complaints Page
                </Link>
              </li>
              <li>
                <Link href="/admin/feedback">
                  Feedback Page
                </Link>
              </li>
              <li>
                <Link href="/admin/maintenance">
                  Maintenance Page
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPortalPage;
