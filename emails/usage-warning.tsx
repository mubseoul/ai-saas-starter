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

interface UsageWarningEmailProps {
  name: string;
  currentUsage: number;
  limit: number;
  percentage: number;
}

export default function UsageWarningEmail({
  name,
  currentUsage,
  limit,
  percentage,
}: UsageWarningEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>You've used {percentage}% of your monthly AI requests</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>⚠️ Usage Alert</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            You've used <strong>{currentUsage} of {limit}</strong> AI requests this month
            ({percentage}% of your limit).
          </Text>

          <Section style={statsBox}>
            <Text style={statsText}>
              <strong>Current Usage:</strong> {currentUsage} requests
            </Text>
            <Text style={statsText}>
              <strong>Monthly Limit:</strong> {limit} requests
            </Text>
            <Text style={statsText}>
              <strong>Remaining:</strong> {limit - currentUsage} requests
            </Text>
          </Section>

          <Text style={text}>
            Your usage resets on the 1st of each month. If you need more requests,
            consider upgrading to our Pro plan for 1,000 monthly requests.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${appUrl}/pricing`}>
              View Pricing Plans
            </Button>
          </Section>

          <Text style={text}>
            <strong>Pro Plan Benefits:</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>1,000 AI requests per month</li>
            <li style={listItem}>Priority processing</li>
            <li style={listItem}>Advanced analytics</li>
            <li style={listItem}>Priority support</li>
          </ul>

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

const statsBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  margin: "24px 48px",
  padding: "20px",
};

const statsText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
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
