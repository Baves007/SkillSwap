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

interface DashboardStats {
  totalIncoming: number;
  pendingIncoming: number;
  acceptedIncoming: number;
  totalOutgoing: number;
  totalRequests: number;
}

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalIncoming: 0,
    pendingIncoming: 0,
    acceptedIncoming: 0,
    totalOutgoing: 0,
    totalRequests: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  const storedUser = localStorage.getItem("user");

  // ============================
  // CHECK LOGIN
  // ============================

  if (!storedUser) {
    navigate("/login");
    return null;
  }

  const user: User = JSON.parse(storedUser);

  // ============================
  // FETCH DASHBOARD STATISTICS
  // ============================

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/swap/stats/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch dashboard statistics"
          );
        }

        setStats(data);

      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user.id]);

  // ============================
  // LOGOUT
  // ============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // ============================
  // RECENT ACTIVITY
  // ============================

  const activities = [
    {
      icon: "📩",
      title: `${stats.pendingIncoming} pending request${
        stats.pendingIncoming !== 1 ? "s" : ""
      }`,
      description:
        stats.pendingIncoming > 0
          ? "Someone wants to start a SkillSwap with you."
          : "No pending requests right now.",
      link: "/requests",
    },
    {
      icon: "🤝",
      title: `${stats.acceptedIncoming} accepted request${
        stats.acceptedIncoming !== 1 ? "s" : ""
      }`,
      description:
        stats.acceptedIncoming > 0
          ? "You have active SkillSwap connections."
          : "Your accepted SkillSwaps will appear here.",
      link: "/requests",
    },
    {
      icon: "📤",
      title: `${stats.totalOutgoing} outgoing request${
        stats.totalOutgoing !== 1 ? "s" : ""
      }`,
      description:
        stats.totalOutgoing > 0
          ? "You have sent SkillSwap requests to others."
          : "Start discovering new SkillSwap partners.",
      link: "/discover",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

      <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8 py-5">

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          Skill
          <span className="text-yellow-400">
            Swap
          </span>{" "}
          
        </Link>

        <div className="flex items-center gap-3">

          <Link
            to="/discover"
            className="rounded-lg px-4 py-2 transition hover:bg-zinc-800 hover:text-yellow-400"
          >
            Discover
          </Link>

          {/* REQUESTS */}

          <Link
            to="/requests"
            className="relative rounded-lg px-4 py-2 transition hover:bg-zinc-800 hover:text-yellow-400"
          >
             Requests

            {!loadingStats &&
              stats.pendingIncoming > 0 && (

                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">

                  {stats.pendingIncoming}

                </span>

              )}

          </Link>

          <Link
            to="/profile"
            className="rounded-lg px-4 py-2 transition hover:bg-zinc-800 hover:text-yellow-400"
          >
            👤 Profile
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/50 px-4 py-2 text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-6 py-10">


        {/* WELCOME */}

        <div className="mb-10">

          <p className="text-yellow-400">
            Welcome back 👋
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Hey, {user.name}! 
          </h1>

          <p className="mt-3 text-zinc-400">
            Here's what's happening with your
            SkillSwap journey.
          </p>

        </div>


        {/* DASHBOARD STATISTICS */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">


          {/* TOTAL REQUESTS */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-yellow-400/40">

            <p className="text-sm text-zinc-400">
               Total Requests
            </p>

            <p className="mt-3 text-3xl font-bold text-white">

              {loadingStats
                ? "..."
                : stats.totalRequests}

            </p>

          </div>


          {/* PENDING */}

          <Link
            to="/requests"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-yellow-400/60 hover:bg-zinc-800"
          >

            <p className="text-sm text-zinc-400">
               Pending
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-400">

              {loadingStats
                ? "..."
                : stats.pendingIncoming}

            </p>

          </Link>


          {/* ACCEPTED */}

          <Link
            to="/requests"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-green-500/50 hover:bg-zinc-800"
          >

            <p className="text-sm text-zinc-400">
               Accepted
            </p>

            <p className="mt-3 text-3xl font-bold text-green-400">

              {loadingStats
                ? "..."
                : stats.acceptedIncoming}

            </p>

          </Link>


          {/* TEACHING */}

          <Link
            to="/profile"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-yellow-400/60 hover:bg-zinc-800"
          >

            <p className="text-sm text-zinc-400">
               Teaching Skills
            </p>

            <p className="mt-3 text-3xl font-bold text-yellow-400">

              {user.teachSkills.length}

            </p>

          </Link>


          {/* LEARNING */}

          <Link
            to="/profile"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-amber-400/60 hover:bg-zinc-800"
          >

            <p className="text-sm text-zinc-400">
               Learning Skills
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-400">

              {user.learnSkills.length}

            </p>

          </Link>

        </div>


        {/* PROFILE CARD */}

        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Your Profile
              </h2>

              <p className="mt-2 text-zinc-400">
                {user.email}
              </p>

              {user.bio && (

                <p className="mt-3 max-w-2xl text-zinc-300">
                  {user.bio}
                </p>

              )}

            </div>

            <Link
              to="/profile"
              className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Edit Profile →
            </Link>

          </div>

        </div>


        {/* SKILLS GRID */}

        <div className="grid gap-8 md:grid-cols-2">


          {/* TEACH SKILLS */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-yellow-400">
                Skills You Can Teach
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Share your knowledge with others.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              {user.teachSkills.length > 0 ? (

                user.teachSkills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm text-yellow-300 ring-1 ring-yellow-400/20"
                  >
                    {skill}
                  </span>

                ))

              ) : (

                <p className="text-zinc-500">
                  No skills added yet.
                </p>

              )}

            </div>

          </div>


          {/* LEARN SKILLS */}

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">

            <div className="mb-5">

              <h2 className="text-xl font-bold text-amber-400">
                 Skills You Want to Learn
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Explore new things and grow.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              {user.learnSkills.length > 0 ? (

                user.learnSkills.map((skill) => (

                  <span
                    key={skill}
                    className="rounded-full bg-amber-400/10 px-4 py-2 text-sm text-amber-300 ring-1 ring-amber-400/20"
                  >
                    {skill}
                  </span>

                ))

              ) : (

                <p className="text-zinc-500">
                  No skills added yet.
                </p>

              )}

            </div>

          </div>

        </div>


        {/* RECENT ACTIVITY */}

        <div className="mt-10">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-yellow-400">
                Your Activity
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                🟢 Recent Activity
              </h2>

            </div>

            <Link
              to="/requests"
              className="text-sm text-yellow-400 transition hover:text-yellow-300"
            >
              View Requests →
            </Link>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            {activities.map((activity) => (

              <Link
                key={activity.title}
                to={activity.link}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-yellow-400/40 hover:bg-zinc-800"
              >

                <div className="text-3xl">
                  {activity.icon}
                </div>

                <h3 className="mt-4 font-semibold">

                  {loadingStats
                    ? "Loading..."
                    : activity.title}

                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {activity.description}
                </p>

              </Link>

            ))}

          </div>

        </div>


        {/* RECOMMENDED MATCHES */}

        <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-yellow-400/10 via-zinc-900 to-zinc-900 p-8">

          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-yellow-400">
                Smart Matching 
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Find Recommended SkillSwap Partners
              </h2>

              <p className="mt-3 max-w-2xl text-zinc-300">
                Discover people whose skills match
                what you want to learn and who may
                want to learn from you.
              </p>

            </div>

            <Link
              to="/discover"
              className="whitespace-nowrap rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Find Matches →
            </Link>

          </div>

        </div>


        {/* MAIN CTA */}

        <div className="mt-10 rounded-2xl border border-yellow-400/20 bg-gradient-to-r from-yellow-400 to-amber-500 p-8 text-black">

          <h2 className="text-2xl font-bold">
            Find your perfect SkillSwap partner 
          </h2>

          <p className="mt-2 text-black/70">
            Discover people who can teach what you
            want to learn.
          </p>

          <Link
            to="/discover"
            className="mt-6 inline-block rounded-xl bg-black px-5 py-3 font-semibold text-yellow-400 transition hover:bg-zinc-900"
          >
            Explore the Community →
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;