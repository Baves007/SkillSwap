import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between border-b border-yellow-500/20 px-8 py-5">

        <Link to="/" className="text-2xl font-bold">
          Skill
          <span className="text-yellow-400">
            Swap
          </span>{" "}
          🤝
        </Link>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="rounded-lg px-5 py-2 transition hover:bg-yellow-400/10 hover:text-yellow-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black transition hover:bg-yellow-300"
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* HERO SECTION */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-yellow-400">
          🚀 Learn. Teach. Connect.
        </div>


        <h1 className="max-w-4xl text-5xl font-bold md:text-7xl">

          Learn What You Need.
          <br />

          <span className="text-yellow-400">
            Teach What You Know.
          </span>

        </h1>


        <p className="mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">

          SkillSwap connects students who want to learn new skills
          with students who are ready to teach them.

        </p>


        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <Link
            to="/register"
            className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
          >
            Start Swapping Skills →
          </Link>


          <Link
            to="/discover"
            className="rounded-xl border border-yellow-500/30 px-6 py-3 text-white transition hover:bg-yellow-400/10 hover:border-yellow-400"
          >
            Explore Skills
          </Link>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-8 py-20">

        <div className="mb-12 text-center">

          <p className="text-yellow-400">
            Simple. Fast. Collaborative.
          </p>

          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            How SkillSwap Works
          </h2>

        </div>


        <div className="grid gap-6 md:grid-cols-3">


          {/* STEP 1 */}
          <div className="rounded-2xl border border-yellow-500/10 bg-zinc-950 p-6 transition hover:border-yellow-400/40 hover:bg-zinc-900">

            <div className="mb-4 text-4xl">
              👤
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Create Your Profile
            </h3>

            <p className="text-gray-400">
              Add the skills you can teach and the skills
              you want to learn.
            </p>

          </div>


          {/* STEP 2 */}
          <div className="rounded-2xl border border-yellow-500/10 bg-zinc-950 p-6 transition hover:border-yellow-400/40 hover:bg-zinc-900">

            <div className="mb-4 text-4xl">
              🤝
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Find Your Match
            </h3>

            <p className="text-gray-400">
              Discover students with skills that match
              what you want to learn.
            </p>

          </div>


          {/* STEP 3 */}
          <div className="rounded-2xl border border-yellow-500/10 bg-zinc-950 p-6 transition hover:border-yellow-400/40 hover:bg-zinc-900">

            <div className="mb-4 text-4xl">
              🚀
            </div>

            <h3 className="mb-2 text-xl font-semibold">
              Start Learning
            </h3>

            <p className="text-gray-400">
              Connect, exchange knowledge, and grow
              together through SkillSwap.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="px-8 pb-20">

        <div className="mx-auto max-w-5xl rounded-3xl border border-yellow-400/30 bg-gradient-to-r from-yellow-400 to-yellow-500 p-10 text-center text-black md:p-16">

          <h2 className="text-3xl font-bold md:text-5xl">
            Ready to Swap Skills?
          </h2>


          <p className="mt-4 text-lg text-black/70">

            Join a community where everyone has something
            to teach and something to learn.

          </p>


          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-yellow-400 transition hover:bg-zinc-900"
          >
            Create Your Profile →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;