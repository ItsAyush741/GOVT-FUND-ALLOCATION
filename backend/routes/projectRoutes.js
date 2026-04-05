const express = require("express");
const router = express.Router();
const { init } = require("../blockchain");


// 🔹 GET SUMMARY (for dashboard cards)
router.get("/summary", async (req, res) => {
    const { contract } = await init();

    const total = await contract.methods.totalBudget().call();
    const allocated = await contract.methods.totalAllocated().call();

    res.json({
        total,
        allocated,
        remaining: total - allocated
    });
});


// 🔹 ALLOCATE FUNDS
router.post("/allocate", async (req, res) => {
    const { projectId, contractor, amount } = req.body;

    const { contract, accounts } = await init();

    await contract.methods.allocateFund(
        projectId,
        "Allocation",
        contractor,
        amount,
        "Phase"
    ).send({ from: accounts[0] });

    res.json({ message: "Funds allocated" });
});

module.exports = router;