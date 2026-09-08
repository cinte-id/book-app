import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import FeedbackForm from "@/components/cs/FeedbackForm";
import ContactForm from "@/components/cs/ContactForm";
import UserSurvey from "@/components/cs/UserSurvey";

export default function ContactPage() {
  return (
    <div className="w-full max-w-md mx-auto min-h-screen pb-24 p-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question or want to share feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Send a message and our team will respond within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>
            Help us improve the app with your suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Satisfaction Survey</CardTitle>
          <CardDescription>
            Tell us how satisfied you are with our support service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSurvey />
        </CardContent>
      </Card>
    </div>
  );
}