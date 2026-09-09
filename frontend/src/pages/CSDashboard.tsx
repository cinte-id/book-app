import React, { useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  Smile,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  user: string;
  email: string;
  category: string;
  priority: "High" | "Normal" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  date: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-104821",
    user: "Budi Santoso",
    email: "budi@gmail.com",
    category: "Peminjaman Buku",
    priority: "High",
    status: "Open",
    date: "2026-09-09",
  },
  {
    id: "TKT-104820",
    user: "Siti Rahma",
    email: "siti.rahma@yahoo.com",
    category: "Akses Akun",
    priority: "Normal",
    status: "In Progress",
    date: "2026-09-08",
  },
  {
    id: "TKT-104819",
    user: "Rian Pratama",
    email: "rian@outlook.com",
    category: "Katalog & Pencarian",
    priority: "Low",
    status: "Resolved",
    date: "2026-09-07",
  },
];

export default function CSDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const updateStatus = (id: string, newStatus: Ticket["status"]) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "Semua" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tombol Kembali ke Beranda */}
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-6 p-2 -ml-2 rounded-lg hover:bg-gray-100"
      >
        <ArrowLeft size={18} />
        <span>Kembali ke Beranda</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Layanan Pengguna</h1>
        <p className="text-gray-500 text-sm">
          Pantau performa layanan dan kelola tiket kendala pengguna.
        </p>
      </div>

      {/* KPI / Analytics Mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Inbox size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Tiket Masuk</p>
            <h3 className="text-xl font-bold text-gray-900">128</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Sedang Diproses</p>
            <h3 className="text-xl font-bold text-gray-900">14</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Selesai (Resolved)</p>
            <h3 className="text-xl font-bold text-gray-900">114</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Smile size={22} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Skor CSAT</p>
            <h3 className="text-xl font-bold text-gray-900">4.8 / 5.0</h3>
          </div>
        </div>
      </div>

      {/* Tabel Tiket */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari ID tiket / nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg text-sm px-3 py-1.5 outline-none bg-white text-gray-600"
            >
              <option>Semua</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">ID Tiket</th>
                <th className="px-5 py-3">Pelapor</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Prioritas</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3.5 font-semibold text-blue-600">{t.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-800">{t.user}</div>
                    <div className="text-xs text-gray-400">{t.email}</div>
                  </td>
                  <td className="px-5 py-3.5">{t.category}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        t.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : t.priority === "Normal"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        t.status === "Open"
                          ? "bg-amber-100 text-amber-800"
                          : t.status === "In Progress"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(t.id, e.target.value as Ticket["status"])
                      }
                      className="border rounded text-xs px-2 py-1 outline-none bg-white text-gray-700"
                    >
                      <option value="Open">Ubah ke Open</option>
                      <option value="In Progress">Ubah ke In Progress</option>
                      <option value="Resolved">Ubah ke Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}