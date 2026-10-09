
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function BloodBankDashboard() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [hospitalRequests, setHospitalRequests] = useState([]);
    const [emergencyRequests, setEmergencyRequests] = useState([]);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {
        const token = sessionStorage.getItem("medreachToken");

        if (!token) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        Promise.all([
            fetch(
                `${API_BASE_URL}/api/blood-bank/inventory`,
                {
                    method: "GET",
                    headers,
                }
            ),

            fetch(
                `${API_BASE_URL}/api/blood-bank/hospital-requests`,
                {
                    method: "GET",
                    headers,
                }
            ),

            fetch(
                `${API_BASE_URL}/api/blood-bank/emergency-blood-requests`,
                {
                    method: "GET",
                    headers,
                }
            ),

            fetch(
                `${API_BASE_URL}/api/blood-bank/hospital-requests/history`,
                {
                    method: "GET",
                    headers,
                }
            ),
        ])
            .then(async (responses) => {
                const [
                    inventoryResponse,
                    hospitalResponse,
                    emergencyResponse,
                    historyResponse,
                ] = responses;

                // =====================================================
                // SESSION EXPIRED
                // =====================================================

                if (
                    inventoryResponse.status === 401 ||
                    hospitalResponse.status === 401 ||
                    emergencyResponse.status === 401 ||
                    historyResponse.status === 401
                ) {
                    sessionStorage.removeItem("medreachToken");
                    localStorage.removeItem("token");

                    alert("Session expired. Please login again.");

                    navigate("/login");
                    return;
                }

                // =====================================================
                // API ERROR
                // =====================================================

                if (
                    !inventoryResponse.ok ||
                    !hospitalResponse.ok ||
                    !emergencyResponse.ok ||
                    !historyResponse.ok
                ) {
                    throw new Error(
                        "One or more Blood Bank APIs failed."
                    );
                }

                // =====================================================
                // READ RESPONSES
                // =====================================================

                const inventoryData =
                    await inventoryResponse.json();

                const hospitalData =
                    await hospitalResponse.json();

                const emergencyData =
                    await emergencyResponse.json();

                const historyData =
                    await historyResponse.json();

                console.log(
                    "Inventory API:",
                    inventoryData
                );

                console.log(
                    "Hospital Requests API:",
                    hospitalData
                );

                console.log(
                    "Emergency Requests API:",
                    emergencyData
                );

                console.log(
                    "History API:",
                    historyData
                );

                // =====================================================
                // SET DATA
                // =====================================================

                setInventory(
                    inventoryData.inventory || []
                );

                setHospitalRequests(
                    hospitalData.requests ||
                    hospitalData.hospital_requests ||
                    []
                );

                setEmergencyRequests(
                    emergencyData.requests ||
                    emergencyData.emergency_requests ||
                    []
                );

                setHistory(
                    historyData.history ||
                    historyData.requests ||
                    historyData.transactions ||
                    []
                );

                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Blood Bank Dashboard Error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load Blood Bank Dashboard."
                );

                setLoading(false);
            });
    }, [navigate]);

    // =====================================================
    // TOTAL AVAILABLE BLOOD
    // =====================================================

    const totalAvailableUnits = inventory.reduce(
        (total, item) => {
            return (
                total +
                Number(item.units_available || 0)
            );
        },
        0
    );

    // =====================================================
    // PENDING HOSPITAL REQUESTS
    // =====================================================

    const pendingHospitalRequests =
        hospitalRequests.filter((request) => {
            const status = String(
                request.status ||
                request.request_status ||
                ""
            ).toUpperCase();

            return (
                status === "PENDING" ||
                status === "REQUESTED"
            );
        });

    // =====================================================
    // PENDING EMERGENCY REQUESTS
    // =====================================================

    const pendingEmergencyRequests =
        emergencyRequests.filter((request) => {
            const itemStatus = String(
                request.item_status ||
                request.status ||
                ""
            ).toUpperCase();

            const responseStatus = String(
                request.response_status ||
                ""
            ).toUpperCase();

            return (
                itemStatus === "PENDING" ||
                responseStatus === "PENDING"
            );
        });

    // =====================================================
    // TOTAL PENDING BLOOD REQUESTS
    // Hospital + Emergency
    // =====================================================

    const totalPendingRequests =
        pendingHospitalRequests.length +
        pendingEmergencyRequests.length;

    // =====================================================
    // COMPLETED REQUESTS
    // =====================================================

    const completedRequests =
        history.filter((request) => {
            const status = String(
                request.status ||
                request.response_status ||
                request.transaction_type ||
                ""
            ).toUpperCase();

            return (
                status === "COMPLETED" ||
                status === "ISSUED"
            );
        }).length;

    // =====================================================
    // COMBINE REQUESTS FOR RECENT REQUEST SECTION
    // =====================================================

    const combinedRequests = [
        ...hospitalRequests.map((request) => ({
            ...request,
            request_type: "HOSPITAL",
        })),

        ...emergencyRequests.map((request) => ({
            ...request,
            request_type: "EMERGENCY",
        })),
    ];

    // =====================================================
    // RECENT REQUESTS
    // =====================================================

    const recentRequests =
        combinedRequests.slice(0, 5);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingCircle}>
                    🩸
                </div>

                <h3>
                    Loading Blood Bank Dashboard...
                </h3>
            </div>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <div style={styles.page}>

            {/* ================= HEADER ================= */}

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Blood Bank Dashboard 🩸
                    </h1>

                    <p style={styles.subtitle}>
                        Manage blood inventory and coordinate
                        hospital and emergency blood requests.
                    </p>
                </div>

                <button
                    style={styles.logoutButton}
                    onClick={() => {
                        sessionStorage.removeItem(
                            "medreachToken"
                        );

                        localStorage.removeItem(
                            "token"
                        );

                        navigate("/login");
                    }}
                >
                    Logout
                </button>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
                <div style={styles.errorBox}>
                    {error}
                </div>
            )}

            {/* ================= SUMMARY ================= */}

            <div style={styles.cardGrid}>

                {/* BLOOD REQUESTS */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        🩸
                    </div>

                    <div>
                        <p style={styles.cardLabel}>
                            Blood Requests
                        </p>

                        <h2 style={styles.cardValue}>
                            {totalPendingRequests}
                        </h2>

                        <p style={styles.cardInfo}>
                            Hospital + Emergency
                        </p>
                    </div>

                </div>

                {/* AVAILABLE BLOOD */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        🩸
                    </div>

                    <div>
                        <p style={styles.cardLabel}>
                            Available Blood
                        </p>

                        <h2 style={styles.cardValue}>
                            {totalAvailableUnits}
                        </h2>

                        <p style={styles.cardInfo}>
                            Total available units
                        </p>
                    </div>

                </div>

                {/* COMPLETED */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        ✅
                    </div>

                    <div>
                        <p style={styles.cardLabel}>
                            Completed Requests
                        </p>

                        <h2 style={styles.cardValue}>
                            {completedRequests}
                        </h2>

                        <p style={styles.cardInfo}>
                            From response history
                        </p>
                    </div>

                </div>

                {/* INVENTORY TYPES */}

                <div style={styles.card}>

                    <div style={styles.icon}>
                        📦
                    </div>

                    <div>
                        <p style={styles.cardLabel}>
                            Inventory Records
                        </p>

                        <h2 style={styles.cardValue}>
                            {inventory.length}
                        </h2>

                        <p style={styles.cardInfo}>
                            Blood inventory entries
                        </p>
                    </div>

                </div>

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Quick Actions
                </h2>

                <div style={styles.actionGrid}>

                    {/* COMBINED REQUEST PAGE */}

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            navigate(
                                "/BloodBank/hospital-requests"
                            )
                        }
                    >
                        🩸 Blood Requests
                    </button>

                    {/* INVENTORY */}

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            navigate(
                                "/BloodBank/inventory"
                            )
                        }
                    >
                        🩸 Manage Inventory
                    </button>

                    {/* HISTORY */}

                    <button
                        style={styles.actionButton}
                        onClick={() =>
                            navigate(
                                "/BloodBank/history"
                            )
                        }
                    >
                        📋 View History
                    </button>

                </div>

            </div>

            {/* ================= RECENT BLOOD REQUESTS ================= */}

            <div style={styles.section}>

                <div style={styles.sectionHeader}>

                    <div>
                        <h2 style={styles.sectionTitle}>
                            Recent Blood Requests
                        </h2>

                        <p style={styles.sectionSubtitle}>
                            Hospital and emergency requests
                        </p>
                    </div>

                    <button
                        style={styles.viewButton}
                        onClick={() =>
                            navigate(
                                "/BloodBank/hospital-requests"
                            )
                        }
                    >
                        View All
                    </button>

                </div>

                {recentRequests.length === 0 ? (

                    <div style={styles.emptyBox}>
                        🩸 No blood requests available.
                    </div>

                ) : (

                    <div style={styles.requestList}>

                        {recentRequests.map(
                            (request, index) => {

                                const status = String(
                                    request.item_status ||
                                    request.response_status ||
                                    request.status ||
                                    request.request_status ||
                                    "PENDING"
                                ).toUpperCase();

                                const bloodGroup =
                                    request.blood_group ||
                                    request.bloodGroup ||
                                    "N/A";

                                const component =
                                    request.blood_component ||
                                    request.bloodComponent ||
                                    "N/A";

                                const quantity =
                                    request.quantity ||
                                    request.units_required ||
                                    request.units ||
                                    0;

                                const requestId =
                                    request.request_id ||
                                    request.requestId ||
                                    request.id ||
                                    index;

                                return (
                                    <div
                                        key={
                                            `${request.request_type}-${requestId}`
                                        }
                                        style={styles.requestCard}
                                    >

                                        <div
                                            style={
                                                styles.requestLeft
                                            }
                                        >

                                            <div
                                                style={
                                                    styles.bloodBadge
                                                }
                                            >
                                                {bloodGroup}
                                            </div>

                                            <div>

                                                <div
                                                    style={
                                                        styles.requestTopRow
                                                    }
                                                >

                                                    <h3
                                                        style={
                                                            styles.requestTitle
                                                        }
                                                    >
                                                        {bloodGroup} Blood Required
                                                    </h3>

                                                    <span
                                                        style={
                                                            request.request_type ===
                                                            "EMERGENCY"
                                                                ? styles.emergencyTypeBadge
                                                                : styles.hospitalTypeBadge
                                                        }
                                                    >
                                                        {request.request_type}
                                                    </span>

                                                </div>

                                                <p
                                                    style={
                                                        styles.requestDetails
                                                    }
                                                >
                                                    Component:{" "}
                                                    <strong>
                                                        {component}
                                                    </strong>
                                                </p>

                                                <p
                                                    style={
                                                        styles.requestDetails
                                                    }
                                                >
                                                    Quantity:{" "}
                                                    <strong>
                                                        {quantity}
                                                    </strong>{" "}
                                                    unit(s)
                                                </p>

                                                {request.city && (
                                                    <p
                                                        style={
                                                            styles.location
                                                        }
                                                    >
                                                        📍{" "}
                                                        {request.city}
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        <span
                                            style={
                                                status === "ACCEPTED"
                                                    ? styles.acceptedBadge
                                                    : status === "REJECTED"
                                                    ? styles.rejectedBadge
                                                    : styles.statusBadge
                                            }
                                        >
                                            {status}
                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

            {/* ================= INVENTORY ================= */}

            <div style={styles.section}>

                <div style={styles.sectionHeader}>

                    <h2 style={styles.sectionTitle}>
                        Current Blood Inventory
                    </h2>

                    <button
                        style={styles.viewButton}
                        onClick={() =>
                            navigate(
                                "/BloodBank/inventory"
                            )
                        }
                    >
                        View Inventory
                    </button>

                </div>

                {inventory.length === 0 ? (

                    <div style={styles.emptyBox}>
                        No available blood inventory.
                    </div>

                ) : (

                    <div style={styles.inventoryGrid}>

                        {inventory
                            .slice(0, 6)
                            .map((item, index) => (

                                <div
                                    key={
                                        item.id ||
                                        index
                                    }
                                    style={
                                        styles.inventoryCard
                                    }
                                >

                                    <div
                                        style={
                                            styles.inventoryHeader
                                        }
                                    >

                                        <strong
                                            style={
                                                styles.bloodGroup
                                            }
                                        >
                                            {
                                                item.blood_group
                                            }
                                        </strong>

                                        <span
                                            style={
                                                styles.availableBadge
                                            }
                                        >
                                            AVAILABLE
                                        </span>

                                    </div>

                                    <p>
                                        Component:{" "}
                                        <strong>
                                            {
                                                item.blood_component
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        Batch:{" "}
                                        <strong>
                                            {
                                                item.batch_number
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        Available Units:{" "}
                                        <strong>
                                            {
                                                item.units_available
                                            }
                                        </strong>
                                    </p>

                                    {item.units_reserved !==
                                        undefined && (
                                        <p>
                                            Reserved Units:{" "}
                                            <strong>
                                                {
                                                    item.units_reserved
                                                }
                                            </strong>
                                        </p>
                                    )}

                                </div>

                            ))}

                    </div>
                )}

            </div>

        </div>
    );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

    page: {
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
    },

    title: {
        margin: 0,
        color: "#991b1b",
        fontSize: "30px",
    },

    subtitle: {
        color: "#64748b",
        marginTop: "8px",
        marginBottom: 0,
    },

    logoutButton: {
        background: "#991b1b",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    errorBox: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "14px",
        borderRadius: "10px",
        marginBottom: "20px",
    },

    cardGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        marginBottom: "30px",
    },

    card: {
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.07)",
    },

    icon: {
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        background: "#fee2e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
    },

    cardLabel: {
        margin: 0,
        color: "#64748b",
        fontSize: "14px",
    },

    cardValue: {
        margin: "5px 0",
        color: "#0f172a",
        fontSize: "28px",
    },

    cardInfo: {
        margin: 0,
        color: "#94a3b8",
        fontSize: "12px",
    },

    section: {
        background: "white",
        padding: "22px",
        borderRadius: "14px",
        marginBottom: "25px",
        boxShadow:
            "0 3px 12px rgba(0,0,0,0.06)",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "18px",
    },

    sectionTitle: {
        margin: 0,
        color: "#1e293b",
        fontSize: "20px",
    },

    sectionSubtitle: {
        margin: "5px 0 0",
        color: "#94a3b8",
        fontSize: "13px",
    },

    actionGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginTop: "18px",
    },

    actionButton: {
        border: "1px solid #fecaca",
        background: "white",
        color: "#991b1b",
        padding: "16px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
    },

    viewButton: {
        background: "#991b1b",
        color: "white",
        border: "none",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600",
    },

    requestList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    requestCard: {
        border: "1px solid #e2e8f0",
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
    },

    requestLeft: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        minWidth: 0,
    },

    bloodBadge: {
        width: "50px",
        height: "50px",
        minWidth: "50px",
        borderRadius: "50%",
        background: "#991b1b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "700",
        fontSize: "14px",
    },

    requestTopRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
    },

    requestTitle: {
        margin: 0,
        fontSize: "16px",
        color: "#1e293b",
    },

    requestDetails: {
        margin: "4px 0",
        color: "#64748b",
        fontSize: "13px",
    },

    location: {
        margin: "4px 0 0",
        color: "#64748b",
        fontSize: "13px",
    },

    hospitalTypeBadge: {
        background: "#dbeafe",
        color: "#1d4ed8",
        padding: "4px 8px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "700",
    },

    emergencyTypeBadge: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "4px 8px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "700",
    },

    statusBadge: {
        background: "#fef3c7",
        color: "#92400e",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    acceptedBadge: {
        background: "#dcfce7",
        color: "#166534",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    rejectedBadge: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    emptyBox: {
        textAlign: "center",
        padding: "30px",
        color: "#64748b",
        border: "1px dashed #cbd5e1",
        borderRadius: "10px",
    },

    inventoryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
    },

    inventoryCard: {
        border: "1px solid #e2e8f0",
        padding: "16px",
        borderRadius: "10px",
        color: "#475569",
        fontSize: "13px",
    },

    inventoryHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },

    bloodGroup: {
        color: "#991b1b",
        fontSize: "22px",
    },

    availableBadge: {
        background: "#dcfce7",
        color: "#166534",
        padding: "4px 7px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "700",
    },

    loadingContainer: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#64748b",
    },

    loadingCircle: {
        fontSize: "45px",
        marginBottom: "15px",
    },
};

export default BloodBankDashboard;
