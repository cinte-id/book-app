import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateTicketId, todayDate, type Ticket } from "./ticketStore";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactFormProps {
  onTicketCreated?: (ticket: Ticket) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = ({ onTicketCreated }: ContactFormProps) => {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [ticketId, setTicketId] = useState("");

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!fields.name.trim()) errs.name = "Name is required.";
    if (!fields.email.trim()) {
      errs.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(fields.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!fields.subject.trim()) errs.subject = "Subject is required.";
    if (!fields.message.trim()) errs.message = "Message is required.";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const id = generateTicketId();
    setTicketId(id);
    onTicketCreated?.({
      id,
      subject: fields.subject.trim(),
      user: fields.email.trim(),
      status: "Open",
      category: "General",
      date: todayDate(),
      message: fields.message.trim(),
    });
  };

  if (ticketId) {
    return (
      <div className="py-4 text-center space-y-4">
        <CheckCircle className="text-green-500 mx-auto" size={40} />
        <p className="font-semibold text-gray-800">
          Ticket Created Successfully
        </p>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Ticket ID</span>
            <span className="font-mono font-semibold text-gray-800">
              {ticketId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              Open
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Response time</span>
            <span className="text-sm text-gray-600">1–2 business days</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Track this ticket in the{" "}
          <span className="font-medium text-gray-700">Support Dashboard</span>{" "}
          below.
        </p>
        <button
          onClick={() => {
            setTicketId("");
            setFields({ name: "", email: "", subject: "", message: "" });
            setErrors({});
          }}
          className="text-sm text-blue-600 font-medium hover:underline"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          placeholder="Your name"
          value={fields.name}
          onChange={handleChange}
          className={
            errors.name ? "border-red-400 focus-visible:ring-red-400" : ""
          }
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={handleChange}
          className={
            errors.email ? "border-red-400 focus-visible:ring-red-400" : ""
          }
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input
          id="contact-subject"
          name="subject"
          placeholder="What is this about?"
          value={fields.subject}
          onChange={handleChange}
          className={
            errors.subject ? "border-red-400 focus-visible:ring-red-400" : ""
          }
        />
        {errors.subject && (
          <p className="text-xs text-red-500">{errors.subject}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Describe your issue or question..."
          rows={4}
          value={fields.message}
          onChange={handleChange}
          className={
            errors.message ? "border-red-400 focus-visible:ring-red-400" : ""
          }
        />
        {errors.message && (
          <p className="text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
