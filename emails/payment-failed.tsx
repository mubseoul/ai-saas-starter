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

interface PaymentFailedEmailProps {
  name: string;
  plan: string;
  amount: string;
  retryDate: string;
}

export default function PaymentFailedEmail({
  name,
  plan,
  amount,
  retryDate,
}: PaymentFailedEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Action required: Payment failed for your subscription</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>⚠️ Payment Failed</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            We were unable to process your payment for your <strong>{plan}</strong> subscription.
          </Text>

          <Section style={errorBox}>
            <Text style={errorTitle}>Payment Details</Text>
            <Text style={detailText}>
              <strong>Plan:</strong> {plan}
            </Text>
            <Text style={detailText}>
              <strong>Amount:</strong> {amount}
            </Text>
            <Text style={detailText}>
              <strong>Next Retry:</strong> {retryDate}
            </Text>
          </Section>

          <Text style={text}>
            <strong>What happens next?</strong>
          </Text>

          <Text style={text}>
            We'll automatically retry your payment on <strong>{retryDate}</strong>.
            To avoid any interruption to your service, please update your payment
            method as soon as possible.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${appUrl}/billing`}>
              Update Payment Method
            </Button>
          </Section>

          <Text style={text}>
            <strong>Common reasons for payment failure:</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>Insufficient funds</li>
            <li style={listItem}>Expired card</li>
            <li style={listItem}>Incorrect card details</li>
            <li style={listItem}>Card issuer declined the payment</li>
          </ul>

          <Text style={text}>
            If you continue to experience issues, please contact your bank or
            reach out to our support team for assistance.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The {appName} Team
          </Text>

          <Text style={footer}>
            <Link href={`${appUrl}/billing`} style={link}>
              Billing Settings
            </Link>
            {" | "}
            <Link href={`${appUrl}/support`} style={link}>
              Contact Support
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

const errorBox = {
  backgroundColor: "#f8d7da",
  borderLeft: "4px solid #dc3545",
  borderRadius: "4px",
  margin: "24px 48px",
  padding: "20px",
};

const errorTitle = {
  color: "#721c24",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const detailText = {
  color: "#721c24",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "4px 0",
};

const buttonContainer = {
  padding: "27px 48px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#dc3545",
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
