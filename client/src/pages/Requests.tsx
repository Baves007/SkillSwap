import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Sender {
  _id: string;
  name: string;
  email: string;
  bio: string;
  teachSkills: string[];
  learnSkills: string[];
}

interface SwapRequest {
  _id: string;
  sender: Sender;
  receiver: string;
  learnSkills: string[];
  teachSkills: string[];
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

function Requests() {
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ==============================
  // FETCH INCOMING REQUESTS
  // ==============================

  const fetchRequests = async () => {
    try {
      if (!currentUser?.id) {
        throw new Error("Please login first");
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/swap/incoming/${currentUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch requests"
        );
      }

      setRequests(data);

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


  // ==============================
  // FETCH WHEN PAGE LOADS
  // ==============================

  useEffect(() => {
    fetchRequests();
  }, []);


  // ==============================
  // ACCEPT / REJECT REQUEST
  // ==============================

  const updateRequestStatus = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {

      setStatusMessage("");

      const response = await fetch(
        `http://localhost:5000/api/swap/${requestId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update request"
        );
      }

      setStatusMessage(
        `Request ${status} successfully! 🎉`
      );


      // Update UI immediately
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: status,
              }
            : request
        )
      );

    } catch (err) {

      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

    }
  };


  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

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
            to="/discover"
            className="rounded-lg border border-yellow-500/30 px-4 py-2 transition hover:bg-yellow-400 hover:text-black"
          >
            Discover
          </Link>


          <Link
            to="/dashboard"
            className="rounded-lg border border-yellow-500/30 px-4 py-2 transition hover:bg-yellow-400 hover:text-black"
          >
            Dashboard
          </Link>

        </div>

      </nav>


      <main className="mx-auto max-w-4xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-10">

          <p className="text-yellow-400">
            📩 SkillSwap Requests
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Incoming Requests
          </h1>

          <p className="mt-3 text-gray-400">
            Review and respond to people who want
            to start a SkillSwap with you.
          </p>

        </div>


        {/* STATUS MESSAGE */}

        {statusMessage && (

          <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300">

            {statusMessage}

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <p className="text-gray-400">
            Loading requests... 📩
          </p>

        )}


        {/* ERROR */}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}


        {/* REQUEST CARDS */}

        {!loading &&
          !error &&
          requests.length > 0 && (

            <div className="space-y-5">

              {requests.map((request) => (

                <div
                  key={request._id}
                  className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-6 transition hover:border-yellow-500/50"
                >


                  {/* SENDER */}

                  <div>

                    <h2 className="text-xl font-bold">

                      {request.sender?.name || "Unknown User"}

                    </h2>


                    <p className="mt-1 text-sm text-gray-500">

                      {request.sender?.email}

                    </p>


                    {request.sender?.bio && (

                      <p className="mt-3 text-sm text-gray-400">

                        {request.sender.bio}

                      </p>

                    )}

                  </div>


                  {/* WANTS TO LEARN FROM YOU */}

                  {request.learnSkills &&
                    request.learnSkills.length > 0 && (

                      <div className="mt-5">

                        <p className="mb-2 text-sm font-semibold text-yellow-400">

                          🎯 Wants to Learn From You

                        </p>


                        <div className="flex flex-wrap gap-2">

                          {request.learnSkills.map(
                            (skill) => (

                              <span
                                key={skill}
                                className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300"
                              >

                                {skill}

                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}


                  {/* CAN TEACH YOU */}

                  {request.teachSkills &&
                    request.teachSkills.length > 0 && (

                      <div className="mt-5">

                        <p className="mb-2 text-sm font-semibold text-yellow-400">

                          💡 Can Teach You

                        </p>


                        <div className="flex flex-wrap gap-2">

                          {request.teachSkills.map(
                            (skill) => (

                              <span
                                key={skill}
                                className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300"
                              >

                                {skill}

                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}


                  {/* MESSAGE */}

                  {request.message && (

                    <div className="mt-5 rounded-xl border border-yellow-500/10 bg-zinc-900 p-4">

                      <p className="text-xs text-gray-500">

                        💬 Message

                      </p>


                      <p className="mt-2 text-sm text-gray-300">

                        {request.message}

                      </p>

                    </div>

                  )}


                  {/* STATUS */}

                  <div className="mt-6 border-t border-yellow-500/10 pt-5">

                    {request.status === "pending" ? (

                      <div className="flex gap-3">


                        {/* ACCEPT */}

                        <button
                          onClick={() =>
                            updateRequestStatus(
                              request._id,
                              "accepted"
                            )
                          }
                          className="rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black transition hover:bg-yellow-300"
                        >

                          ✓ Accept

                        </button>


                        {/* REJECT */}

                        <button
                          onClick={() =>
                            updateRequestStatus(
                              request._id,
                              "rejected"
                            )
                          }
                          className="rounded-lg border border-red-500/50 px-5 py-2 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                        >

                          ✕ Reject

                        </button>

                      </div>

                    ) : (

                      <div>

                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            request.status === "accepted"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >

                          {request.status === "accepted"
                            ? "✓ Accepted"
                            : "✕ Rejected"}

                        </span>

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}


        {/* NO REQUESTS */}

        {!loading &&
          !error &&
          requests.length === 0 && (

            <div className="rounded-2xl border border-yellow-500/20 bg-zinc-950 p-8 text-center">

              <div className="text-4xl">
                📭
              </div>


              <h2 className="mt-4 text-xl font-bold">

                No incoming requests

              </h2>


              <p className="mt-2 text-gray-400">

                When someone requests a SkillSwap
                with you, it will appear here.

              </p>


              <Link
                to="/discover"
                className="mt-5 inline-block rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
              >

                Discover People 🤝

              </Link>

            </div>

          )}

      </main>

    </div>
  );
}

export default Requests;