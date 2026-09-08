import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  teachSkills: string[];
  learnSkills: string[];
}

function Profile() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const currentUser: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [teachSkills, setTeachSkills] = useState("");
  const [learnSkills, setLearnSkills] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // CHECK LOGIN
  // =========================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchProfile = async () => {
    try {
      if (!currentUser?.id) {
        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/auth/user/${currentUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch profile"
        );
      }

      setName(data.name || "");
      setBio(data.bio || "");

      setTeachSkills(
        data.teachSkills
          ? data.teachSkills.join(", ")
          : ""
      );

      setLearnSkills(
        data.learnSkills
          ? data.learnSkills.join(", ")
          : ""
      );

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

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    try {

      if (!currentUser?.id) {
        throw new Error("Please login first");
      }

      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/auth/user/${currentUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            name,

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
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      // =========================
      // UPDATE LOCAL STORAGE
      // =========================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Profile updated successfully! 🚀"
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

    } finally {

      setSaving(false);

    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-10 text-center text-yellow-400">

        Loading profile... 👤

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-black text-white">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="flex items-center justify-between border-b border-yellow-500/20 bg-black px-8 py-5">

        <Link
          to="/"
          className="text-2xl font-bold"
        >

          Skill
          <span className="text-yellow-400">
            Swap
          </span>{" "}
          🤝

        </Link>


        <div className="flex gap-3">

          <Link
            to="/dashboard"
            className="rounded-lg border border-yellow-500/30 px-4 py-2 transition hover:bg-yellow-400 hover:text-black"
          >
            Dashboard
          </Link>


          <Link
            to="/discover"
            className="rounded-lg border border-yellow-500/30 px-4 py-2 transition hover:bg-yellow-400 hover:text-black"
          >
            Discover
          </Link>

        </div>

      </nav>


      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}

      <main className="mx-auto max-w-3xl px-6 py-10">


        {/* HEADER */}

        <div className="mb-10">

          <p className="text-yellow-400">
            Your Profile 👤
          </p>


          <h1 className="mt-2 text-4xl font-bold">

            Manage Your Profile

          </h1>


          <p className="mt-3 text-gray-400">

            Update your information and skills to
            get better SkillSwap matches.

          </p>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (

          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">

            {message}

          </div>

        )}


        {/* ERROR MESSAGE */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        {/* ========================= */}
        {/* PROFILE FORM */}
        {/* ========================= */}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8"
        >


          {/* NAME */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">

              Full Name

            </label>


            <input
              type="text"

              value={name}

              onChange={(e) =>
                setName(e.target.value)
              }

              required

              className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            />

          </div>


          {/* EMAIL */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">

              Email

            </label>


            <input
              type="email"

              value={currentUser?.email || ""}

              disabled

              className="w-full cursor-not-allowed rounded-lg border border-yellow-500/10 bg-zinc-900 px-4 py-3 text-gray-500"
            />


            <p className="mt-2 text-xs text-gray-500">

              Email cannot be changed.

            </p>

          </div>


          {/* BIO */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">

              Bio

            </label>


            <textarea

              value={bio}

              onChange={(e) =>
                setBio(e.target.value)
              }

              placeholder="Tell the SkillSwap community about yourself..."

              rows={4}

              className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"

            />

          </div>


          {/* TEACH SKILLS */}

          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium">

               Skills You Can Teach

            </label>


            <input
              type="text"

              value={teachSkills}

              onChange={(e) =>
                setTeachSkills(e.target.value)
              }

              placeholder="Example: Python, React, UI Design"

              className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            />


            <p className="mt-2 text-xs text-gray-500">

              Separate multiple skills using commas.

            </p>

          </div>


          {/* LEARN SKILLS */}

          <div className="mb-8">

            <label className="mb-2 block text-sm font-medium">

               Skills You Want to Learn

            </label>


            <input
              type="text"

              value={learnSkills}

              onChange={(e) =>
                setLearnSkills(e.target.value)
              }

              placeholder="Example: Machine Learning, Android, UI Design"

              className="w-full rounded-lg border border-yellow-500/20 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-yellow-400"
            />


            <p className="mt-2 text-xs text-gray-500">

              Separate multiple skills using commas.

            </p>

          </div>


          {/* SAVE BUTTON */}

          <button

            type="submit"

            disabled={saving}

            className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"

          >

            {saving
              ? "Saving Changes..."
              : "Save Changes "}

          </button>

        </form>

      </main>

    </div>

  );
}

export default Profile;