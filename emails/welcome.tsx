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

interface WelcomeEmailProps {
  name: string;
  email: string;
}

export default function WelcomeEmail({ name, email }: WelcomeEmailProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI SaaS Starter";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}! Start building with AI today.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to {appName}!</Heading>

          <Text style={text}>Hi {name || "there"},</Text>

          <Text style={text}>
            Thank you for joining {appName}! We're excited to have you on board.
          </Text>

          <Text style={text}>
            Your account (<strong>{email}</strong>) has been successfully created,
            and you're ready to start exploring our AI-powered features.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={`${appUrl}/dashboard`}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={text}>
            <strong>What's next?</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>
              🤖 Try the AI Generator with your free monthly requests
            </li>
            <li style={listItem}>
              📊 Explore your personalized dashboard
            </li>
            <li style={listItem}>
              ⚡ Check out our Pro plan for unlimited power
            </li>
          </ul>

          <Text style={text}>
            If you have any questions, feel free to reach out to our support team.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The {appName} Team
          </Text>

          <Text style={footer}>
            <Link href={`${appUrl}/settings`} style={link}>
              Account Settings
            </Link>
            {" | "}
            <Link href={`${appUrl}/pricing`} style={link}>
              Pricing
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
