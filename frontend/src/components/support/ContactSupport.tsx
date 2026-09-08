import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  category: "",
  priority: "Medium",
  subject: "",
  description: "",
};

export default function ContactSupport() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketId, setTicketId] = useState<string | null>(null);

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
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.category) {
      newErrors.category = "Please select an issue category.";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Please describe your issue.";
    } else if (form.description.trim().length < 10) {
      newErrors.description =
        "Please provide at least 10 characters of information.";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const generatedTicketId = `TKT-${Date.now()
      .toString()
      .slice(-6)}`;

    setTicketId(generatedTicketId);

    const ticket = {
      id: generatedTicketId,
      ...form,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    const existingTickets = JSON.parse(
      localStorage.getItem("booktracker-support-tickets") || "[]"
    );

    localStorage.setItem(
      "booktracker-support-tickets",
      JSON.stringify([ticket, ...existingTickets])
    );

    setForm(initialForm);
    setErrors({});
  };

  if (ticketId) {
    return (
      <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-600" />

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Support Ticket Created
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Your request has been submitted successfully.
            </p>

            <div className="mt-4 rounded-xl bg-white p-4">
              <p className="text-xs font-medium uppercase text-gray-500">
                Ticket ID
              </p>

              <p className="mt-1 text-lg font-bold text-blue-600">
                {ticketId}
              </p>

              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-gray-600">
                  Status: <strong>Open</strong>
                </span>

                <span className="text-gray-600">
                  Priority: <strong>{form.priority}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setTicketId(null)}
              className="mt-4 text-sm font-semibold text-blue-600"
            >
              Submit another request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Contact Support
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Tell us what happened and our support team will review your request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Issue Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a category</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Book Management">Book Management</option>
            <option value="Account">Account</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Other">Other</option>
          </select>

          {errors.category && (
            <p className="mt-1 text-xs text-red-500">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Priority
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Subject
          </label>

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.subject && (
            <p className="mt-1 text-xs text-red-500">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Explain the issue you are experiencing..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          Submit Ticket
        </button>
      </form>
    </section>
  );
}