import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

function BloodBankInventory() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState({
        blood_group: "",
        blood_component: "",
        batch_number: "",
        units_collected: "",
        units_available: "",
        collection_date: "",
        expiry_date: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [editUnits, setEditUnits] = useState("");

    // =====================================================
    // COMMON API RESPONSE HANDLER
    // =====================================================

    const getResponseData = async (response) => {
        const contentType =
            response.headers.get("content-type") || "";

        const text = await response.text();

        console.log("API Status:", response.status);
        console.log("API URL:", response.url);
        console.log("API Content-Type:", contentType);
        console.log("API Raw Response:", text);

        // If backend returned JSON
        if (
            contentType.includes("application/json")
        ) {
            try {
                return JSON.parse(text);
            } catch {
                throw new Error(
                    "Backend returned invalid JSON."
                );
            }
        }

        // Backend returned HTML/text instead of JSON
        if (text.trim().startsWith("<!DOCTYPE") ||
            text.trim().startsWith("<html")) {
            throw new Error(
                `API returned HTML instead of JSON. Status: ${response.status}. Check that backend route exists at: ${response.url}`
            );
        }

        // Try JSON anyway
        try {
            return JSON.parse(text);
        } catch {
            throw new Error(
                text ||
                `API request failed with status ${response.status}`
            );
        }
    };

    // =====================================================
    // GET INVENTORY
    // =====================================================

    const fetchInventory = async () => {
        const token =
            sessionStorage.getItem("medreachToken");

        if (!token) {
            navigate("/login");
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/blood-bank/inventory`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            }
        );

        if (response.status === 401) {
            sessionStorage.removeItem(
                "medreachToken"
            );

            localStorage.removeItem("token");

            alert(
                "Session expired. Please login again."
            );

            navigate("/login");
            return;
        }

        const data =
            await getResponseData(response);

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to fetch inventory"
            );
        }

        console.log(
            "Inventory GET Data:",
            data
        );

        const inventoryData =
            data.inventory ||
            data.inventories ||
            data.data ||
            [];

        if (!Array.isArray(inventoryData)) {
            throw new Error(
                "Inventory API did not return an inventory array."
            );
        }

        setInventory(inventoryData);

        return inventoryData;
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        let active = true;

        const loadInventory = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    sessionStorage.getItem(
                        "medreachToken"
                    );

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `${API_BASE_URL}/api/blood-bank/inventory`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            Accept:
                                "application/json"
                        }
                    }
                );

                if (response.status === 401) {
                    sessionStorage.removeItem(
                        "medreachToken"
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    alert(
                        "Session expired. Please login again."
                    );

                    navigate("/login");
                    return;
                }

                const data =
                    await getResponseData(
                        response
                    );

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch inventory"
                    );
                }

                const inventoryData =
                    data.inventory ||
                    data.inventories ||
                    data.data ||
                    [];

                if (active) {
                    setInventory(
                        Array.isArray(
                            inventoryData
                        )
                            ? inventoryData
                            : []
                    );
                }

            } catch (err) {
                console.error(
                    "Initial Inventory Error:",
                    err
                );

                if (active) {
                    setError(
                        err.message ||
                        "Unable to load inventory"
                    );
                }

            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadInventory();

        return () => {
            active = false;
        };
    }, [navigate]);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =====================================================
    // ADD INVENTORY
    // =====================================================

    const handleAddInventory = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (
            !form.blood_group ||
            !form.blood_component ||
            !form.batch_number ||
            form.units_collected === "" ||
            form.units_available === "" ||
            !form.collection_date ||
            !form.expiry_date
        ) {
            setError(
                "All inventory fields are required."
            );
            return;
        }

        const unitsCollected =
            Number(form.units_collected);

        const unitsAvailable =
            Number(form.units_available);

        if (unitsCollected <= 0) {
            setError(
                "Units collected must be greater than 0."
            );
            return;
        }

        if (unitsAvailable < 0) {
            setError(
                "Available units cannot be negative."
            );
            return;
        }

        if (
            unitsAvailable >
            unitsCollected
        ) {
            setError(
                "Available units cannot be greater than collected units."
            );
            return;
        }

        if (
            new Date(form.expiry_date) <=
            new Date(form.collection_date)
        ) {
            setError(
                "Expiry date must be after collection date."
            );
            return;
        }

        // -----------------------------
        // API
        // -----------------------------

        try {
            setSaving(true);

            const token =
                sessionStorage.getItem(
                    "medreachToken"
                );

            if (!token) {
                navigate("/login");
                return;
            }

            const requestBody = {
                blood_group:
                    form.blood_group,

                blood_component:
                    form.blood_component,

                batch_number:
                    form.batch_number,

                units_collected:
                    unitsCollected,

                units_available:
                    unitsAvailable,

                collection_date:
                    form.collection_date,

                expiry_date:
                    form.expiry_date
            };

            console.log(
                "POST Inventory:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/blood-bank/inventory`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );

            if (response.status === 401) {
                sessionStorage.removeItem(
                    "medreachToken"
                );

                localStorage.removeItem(
                    "token"
                );

                alert(
                    "Session expired. Please login again."
                );

                navigate("/login");
                return;
            }

            const data =
                await getResponseData(
                    response
                );

            console.log(
                "POST Inventory Response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add inventory"
                );
            }

            // =================================================
            // IMPORTANT:
            // GET FRESH DATA FROM DATABASE
            // =================================================

            await fetchInventory();

            // Clear form only after successful refresh
            setForm({
                blood_group: "",
                blood_component: "",
                batch_number: "",
                units_collected: "",
                units_available: "",
                collection_date: "",
                expiry_date: ""
            });

            setSuccessMessage(
                "Inventory added successfully. Inventory list updated."
            );

        } catch (err) {
            console.error(
                "Add Inventory Error:",
                err
            );

            setError(
                err.message ||
                "Unable to add inventory"
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // START UPDATE
    // =====================================================

    const startEdit = (item) => {
        setEditingId(item.id);

        setEditUnits(
            item.units_available ??
            item.available_units ??
            0
        );

        setError("");
        setSuccessMessage("");
    };

    // =====================================================
    // CANCEL UPDATE
    // =====================================================

    const cancelEdit = () => {
        setEditingId(null);
        setEditUnits("");
    };

    // =====================================================
    // UPDATE AVAILABLE UNITS
    // =====================================================

    const handleUpdateUnits = async (id) => {
        setError("");
        setSuccessMessage("");

        if (
            editUnits === "" ||
            editUnits === null
        ) {
            setError(
                "Please enter available units."
            );
            return;
        }

        const unitsAvailable =
            Number(editUnits);

        if (
            Number.isNaN(
                unitsAvailable
            )
        ) {
            setError(
                "Please enter a valid number."
            );
            return;
        }

        if (unitsAvailable < 0) {
            setError(
                "Available units cannot be negative."
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                sessionStorage.getItem(
                    "medreachToken"
                );

            if (!token) {
                navigate("/login");
                return;
            }

            const requestBody = {
                id: id,
                units_available:
                    unitsAvailable
            };

            console.log(
                "PUT Inventory:",
                requestBody
            );

            const response = await fetch(
                `${API_BASE_URL}/api/blood-bank/inventory`,
                {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            requestBody
                        )
                }
            );

            if (response.status === 401) {
                sessionStorage.removeItem(
                    "medreachToken"
                );

                localStorage.removeItem(
                    "token"
                );

                alert(
                    "Session expired. Please login again."
                );

                navigate("/login");
                return;
            }

            const data =
                await getResponseData(
                    response
                );

            console.log(
                "PUT Inventory Response:",
                data
            );

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update inventory"
                );
            }

            // =================================================
            // GET FRESH DATA AFTER UPDATE
            // =================================================

            await fetchInventory();

            setEditingId(null);
            setEditUnits("");

            setSuccessMessage(
                "Inventory updated successfully."
            );

        } catch (err) {
            console.error(
                "Update Inventory Error:",
                err
            );

            setError(
                err.message ||
                "Unable to update inventory"
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px"
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "25px"
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            color: "#7f1d1d"
                        }}
                    >
                        Blood Inventory
                    </h1>

                    <p
                        style={{
                            marginTop: "6px",
                            color: "#666"
                        }}
                    >
                        Manage blood stock and
                        available units
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/BloodBank/dashboard"
                        )
                    }
                    style={{
                        padding:
                            "10px 18px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                            "#7f1d1d",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* SUCCESS */}

            {successMessage && (
                <div
                    style={{
                        background:
                            "#dcfce7",
                        color:
                            "#166534",
                        padding:
                            "12px 16px",
                        borderRadius:
                            "8px",
                        marginBottom:
                            "15px",
                        border:
                            "1px solid #86efac"
                    }}
                >
                    {successMessage}
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div
                    style={{
                        background:
                            "#fee2e2",
                        color:
                            "#991b1b",
                        padding:
                            "12px 16px",
                        borderRadius:
                            "8px",
                        marginBottom:
                            "15px",
                        border:
                            "1px solid #fca5a5"
                    }}
                >
                    {error}
                </div>
            )}

            {/* =================================================
                ADD INVENTORY FORM
            ================================================= */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)"
                }}
            >
                <h2
                    style={{
                        marginTop: 0,
                        color: "#7f1d1d"
                    }}
                >
                    Add New Inventory
                </h2>

                <form
                    onSubmit={
                        handleAddInventory
                    }
                >
                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "16px"
                        }}
                    >
                        <div>
                            <label>
                                Blood Group
                            </label>

                            <select
                                name="blood_group"
                                value={
                                    form.blood_group
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            >
                                <option value="">
                                    Select Blood Group
                                </option>

                                <option value="A+">
                                    A+
                                </option>

                                <option value="A-">
                                    A-
                                </option>

                                <option value="B+">
                                    B+
                                </option>

                                <option value="B-">
                                    B-
                                </option>

                                <option value="AB+">
                                    AB+
                                </option>

                                <option value="AB-">
                                    AB-
                                </option>

                                <option value="O+">
                                    O+
                                </option>

                                <option value="O-">
                                    O-
                                </option>
                            </select>
                        </div>

                        <div>
                            <label>
                                Blood Component
                            </label>

                            <select
                                name="blood_component"
                                value={
                                    form.blood_component
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            >
                                <option value="">
                                    Select Component
                                </option>

                                <option value="WHOLE_BLOOD">
                                    Whole Blood
                                </option>

                                <option value="RBC">
                                    RBC
                                </option>

                                <option value="PLASMA">
                                    Plasma
                                </option>

                                <option value="PLATELETS">
                                    Platelets
                                </option>
                            </select>
                        </div>

                        <div>
                            <label>
                                Batch Number
                            </label>

                            <input
                                type="text"
                                name="batch_number"
                                value={
                                    form.batch_number
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter batch number"
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Units Collected
                            </label>

                            <input
                                type="number"
                                name="units_collected"
                                value={
                                    form.units_collected
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Units Available
                            </label>

                            <input
                                type="number"
                                name="units_available"
                                value={
                                    form.units_available
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Collection Date
                            </label>

                            <input
                                type="date"
                                name="collection_date"
                                value={
                                    form.collection_date
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        <div>
                            <label>
                                Expiry Date
                            </label>

                            <input
                                type="date"
                                name="expiry_date"
                                value={
                                    form.expiry_date
                                }
                                onChange={
                                    handleChange
                                }
                                style={
                                    inputStyle
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            marginTop:
                                "20px",
                            padding:
                                "12px 25px",
                            border: "none",
                            borderRadius:
                                "8px",
                            background:
                                saving
                                    ? "#999"
                                    : "#991b1b",
                            color: "white",
                            cursor:
                                saving
                                    ? "not-allowed"
                                    : "pointer",
                            fontSize:
                                "15px",
                            fontWeight:
                                "600"
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : "Add Inventory"}
                    </button>
                </form>
            </div>

            {/* =================================================
                RECENT INVENTORY
            ================================================= */}

            <div
                style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)"
                }}
            >
                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        alignItems:
                            "center",
                        marginBottom:
                            "20px"
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                color:
                                    "#7f1d1d"
                            }}
                        >
                            Recent Inventory
                        </h2>

                        <p
                            style={{
                                color:
                                    "#777",
                                marginBottom:
                                    0
                            }}
                        >
                            Latest blood
                            inventory records
                        </p>
                    </div>

                    <button
                        onClick={
                            async () => {
                                try {
                                    setError("");
                                    setLoading(
                                        true
                                    );

                                    await fetchInventory();

                                } catch (
                                    err
                                ) {
                                    setError(
                                        err.message
                                    );
                                } finally {
                                    setLoading(
                                        false
                                    );
                                }
                            }
                        }
                        disabled={
                            loading
                        }
                        style={{
                            padding:
                                "9px 15px",
                            border:
                                "1px solid #991b1b",
                            borderRadius:
                                "7px",
                            background:
                                "white",
                            color:
                                "#991b1b",
                            cursor:
                                "pointer"
                        }}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {loading ? (
                    <p>
                        Loading inventory...
                    </p>
                ) : inventory.length ===
                  0 ? (
                    <div
                        style={{
                            padding:
                                "30px",
                            textAlign:
                                "center",
                            color:
                                "#777"
                        }}
                    >
                        No inventory
                        records found.
                    </div>
                ) : (
                    <div
                        style={{
                            overflowX:
                                "auto"
                        }}
                    >
                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                                minWidth:
                                    "1000px"
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background:
                                            "#fef2f2"
                                    }}
                                >
                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        ID
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Blood Group
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Component
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Batch Number
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Collected
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Available
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Collection Date
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Expiry Date
                                    </th>

                                    <th
                                        style={
                                            thStyle
                                        }
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {inventory.map(
                                    (item) => {
                                        const available =
                                            item.units_available ??
                                            item.available_units ??
                                            0;

                                        const collected =
                                            item.units_collected ??
                                            item.collected_units ??
                                            0;

                                        return (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                                style={{
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}
                                            >
                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        item.id
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold"
                                                    }}
                                                >
                                                    {
                                                        item.blood_group
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        item.blood_component
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        item.batch_number
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {
                                                        collected
                                                    }
                                                </td>

                                                <td
                                                    style={{
                                                        ...tdStyle,
                                                        fontWeight:
                                                            "bold",
                                                        color:
                                                            available >
                                                            0
                                                                ? "#15803d"
                                                                : "#dc2626"
                                                    }}
                                                >
                                                    {editingId ===
                                                    item.id ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                editUnits
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setEditUnits(
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            style={{
                                                                width:
                                                                    "80px",
                                                                padding:
                                                                    "7px",
                                                                border:
                                                                    "1px solid #ccc",
                                                                borderRadius:
                                                                    "5px"
                                                            }}
                                                        />
                                                    ) : (
                                                        available
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {formatDate(
                                                        item.collection_date
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {formatDate(
                                                        item.expiry_date
                                                    )}
                                                </td>

                                                <td
                                                    style={
                                                        tdStyle
                                                    }
                                                >
                                                    {editingId ===
                                                    item.id ? (
                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap:
                                                                    "6px"
                                                            }}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateUnits(
                                                                        item.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    saving
                                                                }
                                                                style={{
                                                                    ...smallButtonStyle,
                                                                    background:
                                                                        "#15803d"
                                                                }}
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                onClick={
                                                                    cancelEdit
                                                                }
                                                                style={{
                                                                    ...smallButtonStyle,
                                                                    background:
                                                                        "#6b7280"
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                startEdit(
                                                                    item
                                                                )
                                                            }
                                                            style={{
                                                                ...smallButtonStyle,
                                                                background:
                                                                    "#991b1b"
                                                            }}
                                                        >
                                                            Update
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// =====================================================
// STYLES
// =====================================================

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    marginTop: "6px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    background: "white"
};

const thStyle = {
    padding: "12px",
    textAlign: "left",
    color: "#7f1d1d",
    fontSize: "14px",
    borderBottom:
        "2px solid #fecaca"
};

const tdStyle = {
    padding: "12px",
    fontSize: "14px",
    color: "#374151"
};

const smallButtonStyle = {
    border: "none",
    color: "white",
    padding: "7px 11px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px"
};

export default BloodBankInventory;
