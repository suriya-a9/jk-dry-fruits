"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

export default function DeliveryChargesPage() {
    const [rules, setRules] = useState([]);
    const [newRule, setNewRule] = useState({ max: "", charge: "" });

    useEffect(() => {
        fetchRules();
    }, []);

    async function fetchRules() {
        const res = await fetch("/api/admin/delivery-charges");

        if (!res.ok) {
            console.error("Failed to fetch rules");
            return;
        }

        // Prevent trying to parse empty body
        const text = await res.text();
        if (!text) {
            console.warn("Empty response body");
            return;
        }

        const data = JSON.parse(text);
        setRules(data);
    }


    const handleInputChange = (index, field, value) => {
        const updated = [...rules];
        updated[index][field] = value;
        setRules(updated);
    };

    const handleSave = async (rule, index) => {
        const res = await fetch(`/api/admin/delivery-charges/${rule._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rule),
        });
        if (res.ok) {
            alert("Saved successfully");
            fetchRules();
        } else {
            alert("Failed to save");
        }
    };

    const handleDelete = async (id) => {
        const res = await fetch(`/api/admin/delivery-charges/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            alert("Deleted");
            fetchRules();
        }
    };

    const handleAdd = async () => {
        const res = await fetch("/api/admin/delivery-charges", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRule),
        });
        if (res.ok) {
            setNewRule({ max: "", charge: "" });
            fetchRules();
        } else {
            alert("Failed to add");
        }
    };

    return (
        <DashboardLayout>
            <h2 className="mb-4">Delivery Charge Rules</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Max Weight (gm)</th>
                        <th>Charge (₹)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map((r, index) => (
                        <tr key={r._id}>
                            <td>
                                <input
                                    type="number"
                                    value={r.max}
                                    onChange={(e) =>
                                        handleInputChange(index, "max", e.target.value)
                                    }
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={r.charge}
                                    onChange={(e) =>
                                        handleInputChange(index, "charge", e.target.value)
                                    }
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <button
                                    className="btn btn-sm btn-success me-2"
                                    onClick={() => handleSave(r, index)}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(r._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                                type="number"
                                placeholder="Max weight"
                                value={newRule.max}
                                onChange={(e) =>
                                    setNewRule({ ...newRule, max: e.target.value })
                                }
                                className="form-control"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                placeholder="Charge"
                                value={newRule.charge}
                                onChange={(e) =>
                                    setNewRule({ ...newRule, charge: e.target.value })
                                }
                                className="form-control"
                            />
                        </td>
                        <td>
                            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
                                Add Rule
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </DashboardLayout>
    );
}