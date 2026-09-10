import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../locales/LanguageContext";

type Feedback = {
    id: string;
    name: string;
    email: string;
    type: string;
    rating: string;
    message: string;
    createdAt: string;
};

const Feedback = () => {
    const { t } = useLanguage();
    const [form, setForm] = useState({
        name: "",
        email: "",
        type: "",
        rating: "",
        message: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

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
            newErrors.name = t.support.feedbackNameRequired;
        }

        if (!form.email.trim()) {
            newErrors.email = t.support.feedbackEmailRequired;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = t.support.feedbackInvalidEmail;
        }

        if (!form.type) {
            newErrors.type = t.support.feedbackTypeRequired;
        }

        if (!form.rating) {
            newErrors.rating = t.support.feedbackRatingRequired;
        }

        if (!form.message.trim()) {
            newErrors.message = t.support.feedbackMessageRequired;
        } else if (form.message.trim().length < 10) {
            newErrors.message = t.support.feedbackMessageMin;
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const existingFeedback: Feedback[] = JSON.parse(
            localStorage.getItem("feedback") || "[]"
        );

        const newFeedback: Feedback = {
            id: `FDB-${String(existingFeedback.length + 1).padStart(
                3,
                "0"
            )}`,
            ...form,
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem(
            "feedback",
            JSON.stringify([...existingFeedback, newFeedback])
        );

        setSubmitted(true);

        setForm({
            name: "",
            email: "",
            type: "",
            rating: "",
            message: "",
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-md mx-auto bg-white min-h-screen">
                    <header className="px-4 py-5 border-b bg-white">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/help"
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <ArrowLeft size={20} />
                            </Link>

                            <h1 className="text-xl font-bold text-gray-800">
                                {t.support.feedbackTitle}
                            </h1>
                        </div>
                    </header>

                    <main className="px-4 py-16 text-center">
                        <CheckCircle
                            size={64}
                            className="mx-auto text-green-500"
                        />

                        <h2 className="text-xl font-bold text-gray-800 mt-5">
                            {t.support.feedbackThankYou}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                            {t.support.feedbackSuccess}
                        </p>

                        <div className="space-y-3 mt-6">
                            <button
                                onClick={() => setSubmitted(false)}
                                className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-600"
                            >
                                {t.support.sendAnotherFeedback}
                            </button>

                            <Link
                                to="/help"
                                className="block w-full border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50"
                            >
                                {t.support.backToHelp}
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

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
                                {t.support.feedbackTitle}
                            </h1>

                            <p className="text-sm text-gray-500">
                                {t.support.feedbackSubtitle}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6">
                    <div className="bg-blue-50 rounded-2xl p-5 mb-6">
                        <h2 className="font-semibold text-gray-800">
                            {t.support.feedbackIntroTitle}
                        </h2>

                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            {t.support.feedbackIntroDescription}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.name}
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
                                {t.support.email}
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

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.feedbackType}
                            </label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            >
                                <option value="">{t.support.selectType}</option>
                                <option value="Suggestion">{t.support.suggestion}</option>
                                <option value="Bug Report">{t.support.bugReport}</option>
                                <option value="Feature Request">
                                    {t.support.featureRequest}
                                </option>
                                <option value="General Feedback">
                                    {t.support.generalFeedback}
                                </option>
                            </select>

                            {errors.type && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.ratingQuestion}
                            </label>
                            <select
                                name="rating"
                                value={form.rating}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.rating
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            >
                                <option value="5">★★★★★ {t.support.excellent}</option>
                                <option value="4">★★★★☆ {t.support.good}</option>
                                <option value="3">★★★☆☆ {t.support.average}</option>
                                <option value="2">★★☆☆☆ {t.support.poor}</option>
                                <option value="1">★☆☆☆☆ {t.support.veryPoor}</option>
                            </select>

                            {errors.rating && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.rating}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t.support.yourFeedback}
                            </label>

                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder={t.support.feedbackPlaceholder}
                                rows={5}
                                className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message
                                    ? "border-red-500"
                                    : "border-gray-200"
                                    }`}
                            />

                            {errors.message && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                        >
                            {t.support.submitFeedback}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Feedback;