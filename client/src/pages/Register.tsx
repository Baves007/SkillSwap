import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [teachSkills, setTeachSkills] = useState("");
  const [learnSkills, setLearnSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            bio,

            teachSkills: teachSkills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),

            learnSkills: learnSkills
              .split(",")
              .map((skill) => skill.trim())
              .filter((skill) => skill !== ""),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user data
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Account created successfully! 🎉");

      // Redirect to dashboard
      navigate("/dashboard");

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


      {/* Register Form */}
      <div className="flex justify-center px-6 py-12">

        <div className="w-full max-w-2xl rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 shadow-lg shadow-yellow-500/5">

          <h1 className="text-center text-3xl font-bold">
            Create Your Profile 🚀
          </h1>

          <p className="mt-2 text-center text-gray-400">
            Tell the SkillSwap community what you can teach and want to learn.
          </p>


          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Password */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Bio */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Bio
              </label>

              <textarea
                placeholder="Tell us a little about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

            </div>


            {/* Skills to Teach */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Skills You Can Teach
              </label>

              <input
                type="text"
                placeholder="Example: Python, React, UI Design"
                value={teachSkills}
                onChange={(e) => setTeachSkills(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

              <p className="mt-1 text-sm text-gray-500">
                Separate skills using commas.
              </p>

            </div>


            {/* Skills to Learn */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-200">
                Skills You Want to Learn
              </label>

              <input
                type="text"
                placeholder="Example: Android, Machine Learning"
                value={learnSkills}
                onChange={(e) => setLearnSkills(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />

              <p className="mt-1 text-sm text-gray-500">
                Separate skills using commas.
              </p>

            </div>


            {/* Error Message */}
            {error && (

              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">

                {error}

              </div>

            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Creating Account..."
                : "Create Account 🚀"}

            </button>

          </form>


          <p className="mt-6 text-center text-gray-400">

            Already have an account?{" "}

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

export default Register;