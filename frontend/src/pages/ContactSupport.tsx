import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../locales/LanguageContext";

type Ticket = {
    id: string;
    name: string;
    email: string;
    category: string;
    priority: string;
    subject: string;
    description: string;
    status: "Open" | "In Progress" | "Resolved";
    createdAt: string;
};

const ContactSupport = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        category: "",
        priority: "",
        subject: "",
        description: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!form.category) {
            newErrors.category = "Please select a category.";
        }

        if (!form.priority) {
            newErrors.priority = "Please select a priority.";
        }

        if (!form.subject.trim()) {
            newErrors.subject = "Subject is required.";
        }

        if (!form.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (form.description.trim().length < 10) {
            newErrors.description =
                "Description must be at least 10 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const existingTickets: Ticket[] = JSON.parse(
            localStorage.getItem("tickets") || "[]"
        );

        const newTicket: Ticket = {
            id: `TCK-${String(existingTickets.length + 1).padStart(3, "0")}`,
            ...form,
            status: "Open",
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem(
            "tickets",
            JSON.stringify([...existingTickets, newTicket])
        );

        alert(`${t.support.ticketCreated} Ticket ID: ${newTicket.id}`);
        
        navigate("/tickets");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen">
                {/* Header */}
                <header className="px-4 py-5 border-b bg-white">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/help"
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                <h1>{t.support.contactTitle}</h1>
                            </h1>

                            <p className="text-sm text-gray-500">
                                Tell us how we can help
                            </p>
                        </div>
                    </div>
                </header>

                {/* Form */}
                <main className="px-4 py-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <label>{t.support.name}</label>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder={t.support.namePlaceholder}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <label>{t.support.email}</label>
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={t.support.emailPlaceholder}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            />

                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <label>{t.support.category}</label>
                            </label>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            >
                                <option value="">{t.support.selectCategory}</option>
                                <option value="Account">{t.support.account}</option>
                                <option value="Books">{t.support.books}</option>
                                <option value="Reading">{t.support.reading}</option>
                                <option value="Technical">{t.support.technical}</option>
                                <option value="Billing">{t.support.billing}</option>
                                <option value="Other">{t.support.other}</option>
                            </select>

                            {errors.category && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.priority
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            >
                                <option value="">{t.support.selectPriority}</option>
                                <option value="Low">{t.support.low}</option>
                                <option value="Medium">{t.support.medium}</option>
                                <option value="High">{t.support.high}</option>
                            </select>

                            {errors.priority && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.priority}
                                </p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <label>{t.support.subject}</label>
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder={t.support.subjectPlaceholder}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.subject
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            />

                            {errors.subject && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <label>{t.support.description}</label>
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder={t.support.descriptionPlaceholder}
                                rows={5}
                                className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            />

                            {errors.description && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                        >
                            {t.support.submitTicket}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default ContactSupport;