import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PaymentSuccessEmailProps {
  name: string;
  plan: string;
  amount: string;
  nextBillingDate: string;
}

export default function PaymentSuccessEmail({
  name,
  plan,
  amount,
  nextBillingDate,
}: PaymentSuccessEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Payment successful! Welcome to {plan}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>✅ Payment Successful!</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            Thank you for your payment! Your <strong>{plan}</strong> subscription
            is now active.
          </Text>

          <Section style={successBox}>
            <Text style={successTitle}>Payment Details</Text>
            <Text style={detailText}>
              <strong>Plan:</strong> {plan}
            </Text>
            <Text style={detailText}>
              <strong>Amount:</strong> {amount}
            </Text>
            <Text style={detailText}>
              <strong>Next Billing Date:</strong> {nextBillingDate}
            </Text>
          </Section>

          <Text style={text}>
            You now have access to all {plan} features, including:
          </Text>

          <ul style={list}>
            <li style={listItem}>1,000 AI requests per month</li>
            <li style={listItem}>Priority processing</li>
            <li style={listItem}>Advanced analytics</li>
            <li style={listItem}>Priority support</li>
            <li style={listItem}>Early access to new features</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href={`${appUrl}/dashboard`}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            You can manage your subscription, update payment methods, or download
            invoices anytime from your billing page.
          </Text>

          <Text style={footer}>
            Thank you for your business!
            <br />
            The {appName} Team
          </Text>

          <Text style={footer}>
            <Link href={`${appUrl}/billing`} style={link}>
              Manage Subscription
            </Link>
            {" | "}
            <Link href={`${appUrl}/support`} style={link}>
              Support
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
  margin: "30px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const successBox = {
  backgroundColor: "#d4edda",
  borderLeft: "4px solid #28a745",
  borderRadius: "4px",
  margin: "24px 48px",
  padding: "20px",
};

const successTitle = {
  color: "#155724",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const detailText = {
  color: "#155724",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "4px 0",
};

const buttonContainer = {
  padding: "27px 48px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const list = {
  padding: "0 48px",
  margin: "16px 0",
};

const listItem = {
  marginBottom: "12px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "0 48px",
  marginTop: "24px",
};

const link = {
  color: "#556cd6",
  textDecoration: "underline",
};
