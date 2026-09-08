import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { contactSubjects } from "@/data/support";

interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): ContactFormErrors => {
    const next: ContactFormErrors = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.subject) next.subject = "Please choose a subject.";
    if (!form.message.trim()) {
      next.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      next.message = "Message should be at least 10 characters.";
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast({
      title: "Message sent",
      description: "Our support team will get back to you within 24 hours.",
    });
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Select
          value={form.subject}
          onValueChange={(value) => handleChange("subject", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {contactSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="How can we help you?"
          rows={5}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      <Button type="submit">Send Message</Button>
    </form>
  );
}
