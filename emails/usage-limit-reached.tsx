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

interface UsageLimitReachedEmailProps {
  name: string;
  limit: number;
  resetDate: string;
}

export default function UsageLimitReachedEmail({
  name,
  limit,
  resetDate,
}: UsageLimitReachedEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>You've reached your monthly AI request limit</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🚫 Usage Limit Reached</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            You've reached your monthly limit of <strong>{limit} AI requests</strong>.
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              Your requests will reset on <strong>{resetDate}</strong>
            </Text>
          </Section>

          <Text style={text}>
            To continue using AI features without waiting, upgrade to our Pro plan
            for 1,000 monthly requests and priority processing.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${appUrl}/pricing`}>
              Upgrade to Pro
            </Button>
          </Section>

          <Text style={text}>
            <strong>Why upgrade to Pro?</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>
              <strong>1,000 requests/month</strong> - 100x more than free tier
            </li>
            <li style={listItem}>
              <strong>Priority processing</strong> - Faster response times
            </li>
            <li style={listItem}>
              <strong>Advanced analytics</strong> - Track your usage patterns
            </li>
            <li style={listItem}>
              <strong>Priority support</strong> - Get help when you need it
            </li>
          </ul>

          <Text style={text}>
            Questions? Our support team is here to help!
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The {appName} Team
          </Text>

          <Text style={footer}>
            <Link href={`${appUrl}/dashboard`} style={link}>
              Dashboard
            </Link>
            {" | "}
            <Link href={`${appUrl}/billing`} style={link}>
              Billing
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

const warningBox = {
  backgroundColor: "#fff3cd",
  borderLeft: "4px solid #ffc107",
  borderRadius: "4px",
  margin: "24px 48px",
  padding: "20px",
};

const warningText = {
  color: "#856404",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0",
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
