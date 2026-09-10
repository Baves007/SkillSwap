import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password"
        );
      }

      setMessage(
        "Password reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-yellow-500/20 px-8 py-5">

        <Link to="/" className="text-2xl font-bold">
          Skill
          <span className="text-yellow-400">
            Swap
          </span>{" "}
          🤝
        </Link>

        <Link
          to="/login"
          className="rounded-lg border border-yellow-500/50 px-4 py-2 text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          Login
        </Link>

      </nav>


      {/* Reset Password Form */}
      <div className="flex min-h-[80vh] items-center justify-center px-6">

        <div className="w-full max-w-md rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 shadow-lg shadow-yellow-500/5">

          <h1 className="text-center text-3xl font-bold">
            Reset Password 🔐
          </h1>

          <p className="mt-3 text-center text-gray-400">
            Create a new password for your account.
          </p>


          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* New Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Confirm Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Confirm New Password
              </label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Success Message */}
            {message && (

              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">

                {message}

              </div>

            )}


            {/* Error Message */}
            {error && (

              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">

                {error}

              </div>

            )}


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Resetting Password..."
                : "Reset Password 🔐"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;