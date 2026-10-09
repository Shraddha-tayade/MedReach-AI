import { useEffect, useState } from "react";

function BloodBankHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET BLOOD BANK HISTORY
    // =====================================================

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token =
                    sessionStorage.getItem("medreachToken");

                if (!token) {
                    setError(
                        "Session expired. Please login again."
                    );
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/blood-bank/history",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                console.log(
                    "Blood Bank History API Response:",
                    data
                );

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch blood bank history"
                    );
                }

                if (Array.isArray(data.history)) {
                    setHistory(data.history);
                } else if (Array.isArray(data.histories)) {
                    setHistory(data.histories);
                } else if (Array.isArray(data.transactions)) {
                    setHistory(data.transactions);
                } else if (Array.isArray(data)) {
                    setHistory(data);
                } else {
                    setHistory([]);
                }

            } catch (error) {
                console.error(
                    "Blood Bank History Error:",
                    error
                );

                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // =====================================================
    // GET HISTORY ID
    // =====================================================

    const getHistoryId = (item) => {
        return (
            item.id ??
            item.history_id ??
            item.historyId ??
            item.transaction_id ??
            item.transactionId ??
            item.stock_transaction_id ??
            item.stockTransactionId ??
            "—"
        );
    };

    // =====================================================
    // GET INVENTORY ID
    // =====================================================

    const getInventoryId = (item) => {
        return (
            item.inventory_id ??
            item.inventoryId ??
            "—"
        );
    };

    // =====================================================
    // GET TRANSACTION TYPE
    // =====================================================

    const getTransactionType = (item) => {
        return (
            item.transaction_type ??
            item.transactionType ??
            "—"
        );
    };

    // =====================================================
    // GET UNITS
    // =====================================================

    const getUnits = (item) => {
        return (
            item.units ??
            item.quantity ??
            item.units_used ??
            "—"
        );
    };

    // =====================================================
    // GET REFERENCE ID
    // =====================================================

    const getReferenceId = (item) => {
        return (
            item.reference_id ??
            item.referenceId ??
            "—"
        );
    };

    // =====================================================
    // GET NOTES
    // =====================================================

    const getNotes = (item) => {
        return item.notes ?? "—";
    };

    // =====================================================
    // GET DATE
    // =====================================================

    const getDate = (item) => {
        return (
            item.created_at ??
            item.createdAt ??
            item.transaction_date ??
            item.transactionDate ??
            item.date ??
            null
        );
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return "—";
        }

        return formattedDate.toLocaleString();
    };

    // =====================================================
    // TRANSACTION STYLE
    // =====================================================

    const getTransactionStyle = (type) => {
        switch (type) {
            case "RECEIVED":
                return "bg-green-100 text-green-700";

            case "USED":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600">
                    Loading blood history...
                </p>
            </div>
        );
    }

    // =====================================================
    // COUNTS
    // =====================================================

    const receivedCount =
        history.filter(
            (item) =>
                getTransactionType(item) === "RECEIVED"
        ).length;

    const usedCount =
        history.filter(
            (item) =>
                getTransactionType(item) === "USED"
        ).length;

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* HEADER */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold text-gray-800">
                    Blood Bank History
                </h1>

                <p className="text-gray-500 mt-1">
                    View blood inventory transactions
                    and activities.
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                {/* TOTAL */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-sm text-gray-500">
                        Total Transactions
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800 mt-2">
                        {history.length}
                    </h2>

                </div>

                {/* RECEIVED */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-sm text-gray-500">
                        Received
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {receivedCount}
                    </h2>

                </div>

                {/* USED */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-sm text-gray-500">
                        Used
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                        {usedCount}
                    </h2>

                </div>

            </div>

            {/* HISTORY TABLE */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-5 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        Transaction History
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Blood inventory transaction records.
                    </p>

                </div>

                {history.length === 0 ? (

                    <div className="p-10 text-center text-gray-500">
                        No blood transaction history available.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-100">

                                <tr>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Inventory ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Transaction
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Units
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Reference ID
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Notes
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {history.map(
                                    (item, index) => {

                                        const historyId =
                                            getHistoryId(item);

                                        const inventoryId =
                                            getInventoryId(item);

                                        const transactionType =
                                            getTransactionType(
                                                item
                                            );

                                        return (
                                            <tr
                                                key={
                                                    historyId !== "—"
                                                        ? historyId
                                                        : index
                                                }
                                                className="border-t hover:bg-gray-50"
                                            >

                                                <td className="px-5 py-4 text-gray-700 font-medium">
                                                    {historyId}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {inventoryId}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTransactionStyle(
                                                            transactionType
                                                        )}`}
                                                    >
                                                        {transactionType}
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4 font-semibold text-gray-800">
                                                    {getUnits(item)}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {getReferenceId(item)}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {getNotes(item)}
                                                </td>

                                                <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                                    {formatDate(
                                                        getDate(item)
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

export default BloodBankHistory;
