const express = require("express");
const SwapRequest = require("../models/SwapRequest");

const router = express.Router();


// ==============================
// SEND SKILLSWAP REQUEST
// ==============================
router.post("/request", async (req, res) => {
  try {
    const {
      sender,
      receiver,
      learnSkills,
      teachSkills,
      message,
    } = req.body;


    // ==============================
    // VALIDATION
    // ==============================

    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Sender and receiver are required",
      });
    }


    // Prevent sending request to yourself

    if (sender === receiver) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }


    // Make sure at least one matching skill exists

    if (
      (!learnSkills || learnSkills.length === 0) &&
      (!teachSkills || teachSkills.length === 0)
    ) {
      return res.status(400).json({
        message: "At least one matching skill is required",
      });
    }


    // ==============================
    // CHECK DUPLICATE REQUEST
    // ==============================

    const existingRequest =
      await SwapRequest.findOne({
        sender,
        receiver,
        status: "pending",
      });


    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already have a pending SkillSwap request with this user",
      });
    }


    // ==============================
    // CREATE REQUEST
    // ==============================

    const swapRequest =
      await SwapRequest.create({
        sender,
        receiver,
        learnSkills: learnSkills || [],
        teachSkills: teachSkills || [],
        message: message || "",
      });


    res.status(201).json({
      message: "SkillSwap request sent successfully 🤝",
      swapRequest,
    });

  } catch (error) {

    console.error(
      "SkillSwap request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });

  }
});
// ==============================
// GET INCOMING REQUESTS
// ==============================

router.get("/incoming/:userId", async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      receiver: req.params.userId,
    })
      .populate(
        "sender",
        "name email bio teachSkills learnSkills"
      )
      .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {

    console.error(
      "Fetch incoming requests error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });

  }
});


// ==============================
// ACCEPT / REJECT REQUEST
// ==============================

router.put("/:requestId/status", async (req, res) => {
  try {

    const { status } = req.body;

    // Validate status

    if (
      status !== "accepted" &&
      status !== "rejected"
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }


    const swapRequest =
      await SwapRequest.findById(
        req.params.requestId
      );


    if (!swapRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }


    // Update status

    swapRequest.status = status;

    await swapRequest.save();


    res.json({
      message: `Request ${status} successfully`,
      swapRequest,
    });

  } catch (error) {

    console.error(
      "Update request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });

  }
});
// ==============================
// GET USER DASHBOARD STATISTICS
// ==============================
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Incoming requests
    const totalIncoming = await SwapRequest.countDocuments({
      receiver: userId,
    });

    // Pending incoming requests
    const pendingIncoming = await SwapRequest.countDocuments({
      receiver: userId,
      status: "pending",
    });

    // Accepted incoming requests
    const acceptedIncoming = await SwapRequest.countDocuments({
      receiver: userId,
      status: "accepted",
    });

    // Outgoing requests
    const totalOutgoing = await SwapRequest.countDocuments({
      sender: userId,
    });

    res.json({
      totalIncoming,
      pendingIncoming,
      acceptedIncoming,
      totalOutgoing,
      totalRequests: totalIncoming + totalOutgoing,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
});
// ==============================
// GET PENDING NOTIFICATION COUNT
// ==============================
router.get("/notifications/count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const pendingCount = await SwapRequest.countDocuments({
      receiver: userId,
      status: "pending",
    });

    res.json({
      pendingCount,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});


module.exports = router;