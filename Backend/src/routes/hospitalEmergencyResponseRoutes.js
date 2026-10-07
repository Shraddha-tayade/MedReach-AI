const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const hospitalEmergencyResponseController =
    require("../controllers/hospitalEmergencyResponseController");


router.put(
    "/:requestId/:requestItemId",
    authenticateToken,
    hospitalEmergencyResponseController.respondToEmergencyRequest
);

router.post(
    "/:requestId/:requestItemId/confirm/:hospitalId",
    authenticateToken,
    hospitalEmergencyResponseController.confirmHospitalSelection
);

router.put(
    "/:requestId/:requestItemId/cancel",
    authenticateToken,
    hospitalEmergencyResponseController.cancelHospitalReservation
);

router.put(
    "/:requestId/:requestItemId/arrived",
    authenticateToken,
    hospitalEmergencyResponseController.markHospitalArrived
);

router.put(
    "/:requestId/:requestItemId/complete",
    authenticateToken,
    hospitalEmergencyResponseController.completeHospitalRequest
);

module.exports = router;