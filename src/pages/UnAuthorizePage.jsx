
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card bg-base-100 shadow-xl max-w-md w-full text-center">
        <div className="card-body items-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6">
            <ShieldAlert size={48} className="text-error" />
          </div>

          {/* Title */}
          <h1 className="text-6xl font-bold text-error mb-2">403</h1>
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>

          {/* Message */}
          <p className="text-base-content/70 mb-8">
            Sorry, you don't have permission to access this page.<br />
            Please contact your administrator if you believe this is an error.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link to="/dashboard" className="btn btn-primary flex-1 gap-2">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <Link to="/login" className="btn btn-outline flex-1">
              Login with different account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}