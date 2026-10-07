const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const controller =
    require("../controllers/emergencyBloodResponseController");


/*
===========================================================
ACCEPT / REJECT
===========================================================

PUT
/api/blood-bank/emergency-blood-responses/:requestId/:requestItemId
*/

router.put(
    "/:requestId/:requestItemId",
    authenticateToken,
    controller.respondToEmergencyBloodRequest
);


/*
===========================================================
CONFIRM BLOOD BANK + RESERVE BLOOD
===========================================================

POST
/api/blood-bank/emergency-blood-responses/:requestId/:requestItemId/confirm/:bloodBankId
*/

router.post(
    "/:requestId/:requestItemId/confirm/:bloodBankId",
    authenticateToken,
    controller.confirmBloodBank
);


/*
===========================================================
CANCEL
===========================================================

PUT
/api/blood-bank/emergency-blood-responses/:requestId/:requestItemId/cancel
*/

router.put(
    "/:requestId/:requestItemId/cancel",
    authenticateToken,
    controller.cancelEmergencyBloodRequest
);


/*
===========================================================
ARRIVED
===========================================================

PUT
/api/blood-bank/emergency-blood-responses/:requestId/:requestItemId/arrived
*/

router.put(
    "/:requestId/:requestItemId/arrived",
    authenticateToken,
    controller.markEmergencyBloodArrived
);


/*
===========================================================
ISSUE BLOOD
===========================================================

PUT
/api/blood-bank/emergency-blood-responses/:requestId/:requestItemId/issue
*/

router.put(
    "/:requestId/:requestItemId/issue",
    authenticateToken,
    controller.issueEmergencyBlood
);


module.exports = router;