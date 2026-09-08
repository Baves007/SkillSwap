import { Link } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong"
        );
      }

      setMessage(data.message);

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


      {/* Content */}
      <div className="flex min-h-[80vh] items-center justify-center px-6">

        <div className="w-full max-w-md rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 shadow-lg shadow-yellow-500/5">

          <h1 className="text-center text-3xl font-bold">
            Forgot Password? 🔐
          </h1>

          <p className="mt-3 text-center text-gray-400">
            Enter your registered email address and
            we'll help you reset your password.
          </p>


          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Success Message */}
            {message && (

              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">

                {message}

              </div>

            )}


            {/* Error */}
            {error && (

              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">

                {error}

              </div>

            )}


            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Sending..."
                : "Send Reset Link"}

            </button>

          </form>


          <p className="mt-6 text-center text-sm text-gray-400">

            Remember your password?{" "}

            <Link
              to="/login"
              className="text-yellow-400 transition hover:text-yellow-300"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;