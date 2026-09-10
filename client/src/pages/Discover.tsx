import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  teachSkills: string[];
  learnSkills: string[];
}

interface MatchedUser extends User {
  matchScore: number;
  theyCanTeachYou: string[];
  youCanTeachThem: string[];
}

function Discover() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestMessages, setRequestMessages] = useState<
    Record<string, string>
  >({});

  const [requestStatus, setRequestStatus] = useState("");

  const [sendingRequest, setSendingRequest] =
    useState<string | null>(null);

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;


  // ============================
  // FETCH USERS
  // ============================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/users`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch users"
          );
        }

        setUsers(data);

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

    fetchUsers();
  }, []);


  // ============================
  // SEND SKILLSWAP REQUEST
  // ============================

  const handleRequest = async (
    receiverId: string,
    theyCanTeachYou: string[],
    youCanTeachThem: string[]
  ) => {

    try {

      if (!currentUser?.id) {
        throw new Error("Please login first");
      }

      setSendingRequest(receiverId);
      setRequestStatus("");

      const response = await fetch(
        `${API_URL}/api/swap/request`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sender: currentUser.id,
            receiver: receiverId,

            learnSkills: theyCanTeachYou,

            teachSkills: youCanTeachThem,

            message: requestMessages[receiverId] || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to send request"
        );
      }

      setRequestStatus(
        "SkillSwap request sent successfully! "
      );

      setRequestMessages((prev) => ({
        ...prev,
        [receiverId]: "",
      }));

    } catch (err) {

      setRequestStatus(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

    } finally {

      setSendingRequest(null);

    }
  };


  // ============================
  // TWO-WAY SMART MATCHING
  // ============================

  const matchedUsers: MatchedUser[] = users

    .filter(
      (user) => user._id !== currentUser?.id
    )

    .map((user) => {

      const currentUserLearnSkills =
        currentUser?.learnSkills || [];

      const currentUserTeachSkills =
        currentUser?.teachSkills || [];

      const otherUserTeachSkills =
        user.teachSkills || [];

      const otherUserLearnSkills =
        user.learnSkills || [];


      // THEY CAN TEACH YOU

      const theyCanTeachYou =
        currentUserLearnSkills.filter(
          (skill: string) =>
            otherUserTeachSkills.some(
              (teachSkill) =>
                teachSkill.toLowerCase().trim() ===
                skill.toLowerCase().trim()
            )
        );


      // YOU CAN TEACH THEM

      const youCanTeachThem =
        currentUserTeachSkills.filter(
          (skill: string) =>
            otherUserLearnSkills.some(
              (learnSkill) =>
                learnSkill.toLowerCase().trim() ===
                skill.toLowerCase().trim()
            )
        );


      // MATCH SCORE

      const totalMatches =
        theyCanTeachYou.length +
        youCanTeachThem.length;

      const totalPossibleSkills =
        currentUserLearnSkills.length +
        currentUserTeachSkills.length;

      const matchScore =
        totalPossibleSkills > 0
          ? Math.round(
              (totalMatches /
                totalPossibleSkills) *
                100
            )
          : 0;


      return {
        ...user,
        matchScore,
        theyCanTeachYou,
        youCanTeachThem,
      };

    })


    // ============================
    // SEARCH FILTER
    // ============================

    .filter((user) => {

      const searchText =
        search.toLowerCase();

      return (

        user.name
          .toLowerCase()
          .includes(searchText) ||

        user.teachSkills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        ) ||

        user.learnSkills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchText)
        )

      );

    })


    // ============================
    // BEST MATCH FIRST
    // ============================

    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );


  return (

    <div className="min-h-screen bg-black text-white">

      {/* REUSABLE NAVBAR */}

      <Navbar />


      <main className="mx-auto max-w-6xl px-6 py-10">


        {/* HEADER */}

        <div className="mb-10">

          <p className="text-yellow-400">
             Two-Way Smart Matching
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Find Your Perfect SkillSwap Partner
          </h1>

          <p className="mt-3 text-gray-400">
            Find people where both of you can learn
            and teach each other.
          </p>

        </div>


        {/* REQUEST STATUS */}

        {requestStatus && (

          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">

            {requestStatus}

          </div>

        )}


        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="mb-10 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
        />


        {/* LOADING */}

        {loading && (

          <p className="text-gray-400">
            Finding SkillSwap partners...
          </p>

        )}


        {/* ERROR */}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        {/* USER CARDS */}

        {!loading && !error && (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {matchedUsers.map((user) => (

              <div
                key={user._id}
                className="relative rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6 transition hover:border-yellow-400/50"
              >


                {/* MATCH SCORE */}

                <div className="absolute right-5 top-5">

                  <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">

                    {user.matchScore}% Match 

                  </div>

                </div>


                {/* NAME */}

                <h2 className="pr-28 text-xl font-bold">

                  {user.name}

                </h2>


                <p className="mt-1 text-sm text-gray-500">

                  {user.email}

                </p>


                {/* BIO */}

                {user.bio && (

                  <p className="mt-4 text-sm text-gray-400">

                    {user.bio}

                  </p>

                )}


                {/* MATCH DETAILS */}

                <div className="mt-5 space-y-5">


                  {/* THEY CAN TEACH YOU */}

                  {user.theyCanTeachYou.length > 0 && (

                    <div>

                      <p className="mb-2 text-sm font-semibold text-green-400">

                         They Can Teach You

                      </p>


                      <div className="flex flex-wrap gap-2">

                        {user.theyCanTeachYou.map(
                          (skill) => (

                            <span
                              key={skill}
                              className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400"
                            >

                              {skill}

                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* YOU CAN TEACH THEM */}

                  {user.youCanTeachThem.length > 0 && (

                    <div>

                      <p className="mb-2 text-sm font-semibold text-yellow-400">

                         You Can Teach Them

                      </p>


                      <div className="flex flex-wrap gap-2">

                        {user.youCanTeachThem.map(
                          (skill) => (

                            <span
                              key={skill}
                              className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400"
                            >

                              {skill}

                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                  {/* ALL TEACH SKILLS */}

                  <div>

                    <p className="mb-2 text-sm font-semibold text-yellow-400">

                       Can Teach

                    </p>


                    <div className="flex flex-wrap gap-2">

                      {user.teachSkills.map(
                        (skill) => (

                          <span
                            key={skill}
                            className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300"
                          >

                            {skill}

                          </span>

                        )
                      )}

                    </div>

                  </div>


                  {/* ALL LEARN SKILLS */}

                  <div>

                    <p className="mb-2 text-sm font-semibold text-gray-300">

                       Wants to Learn

                    </p>


                    <div className="flex flex-wrap gap-2">

                      {user.learnSkills.map(
                        (skill) => (

                          <span
                            key={skill}
                            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-gray-300"
                          >

                            {skill}

                          </span>

                        )
                      )}

                    </div>

                  </div>

                </div>


                {/* SKILLSWAP REQUEST */}

                <div className="mt-6 border-t border-zinc-800 pt-5">

                  <p className="mb-3 text-sm font-semibold">

                     Start a SkillSwap

                  </p>


                  {(user.theyCanTeachYou.length > 0 ||
                    user.youCanTeachThem.length > 0) ? (

                    <div className="space-y-3">


                      {/* MESSAGE */}

                      <textarea
                        placeholder="Add a message (optional)..."
                        value={
                          requestMessages[user._id] || ""
                        }
                        onChange={(e) =>

                          setRequestMessages((prev) => ({
                            ...prev,
                            [user._id]: e.target.value,
                          }))

                        }
                        rows={2}
                        className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                      />


                      {/* REQUEST BUTTON */}

                      <button
                        type="button"

                        onClick={() =>
                          handleRequest(
                            user._id,
                            user.theyCanTeachYou,
                            user.youCanTeachThem
                          )
                        }

                        disabled={
                          sendingRequest === user._id
                        }

                        className="w-full cursor-pointer rounded-lg bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {sendingRequest === user._id
                          ? "Sending Request..."
                          : " Request SkillSwap"}

                      </button>

                    </div>

                  ) : (

                    <p className="text-sm text-gray-500">

                      No SkillSwap match available yet.

                    </p>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}


        {/* NO USERS */}

        {!loading &&
          !error &&
          matchedUsers.length === 0 && (

            <div className="rounded-xl border border-yellow-500/20 bg-zinc-950 p-6 text-gray-400">

              No SkillSwap partners found.

            </div>

          )}

      </main>

    </div>

  );
}

export default Discover;