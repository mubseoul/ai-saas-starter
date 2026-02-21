/**
 * Audit logging system for tracking important user actions and security events
 * In production, consider sending logs to a dedicated logging service like:
 * - Logtail
 * - Datadog
 * - New Relic
 * - Sentry
 */

export enum AuditAction {
  // Authentication
  USER_SIGNUP = "USER_SIGNUP",
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  PASSWORD_RESET_REQUEST = "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE = "PASSWORD_RESET_COMPLETE",

  // Account Management
  ACCOUNT_UPDATED = "ACCOUNT_UPDATED",
  ACCOUNT_DELETED = "ACCOUNT_DELETED",
  EMAIL_CHANGED = "EMAIL_CHANGED",

  // Subscription & Billing
  SUBSCRIPTION_CREATED = "SUBSCRIPTION_CREATED",
  SUBSCRIPTION_UPDATED = "SUBSCRIPTION_UPDATED",
  SUBSCRIPTION_CANCELED = "SUBSCRIPTION_CANCELED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",

  // AI Generation
  AI_GENERATION_SUCCESS = "AI_GENERATION_SUCCESS",
  AI_GENERATION_FAILED = "AI_GENERATION_FAILED",
  USAGE_LIMIT_REACHED = "USAGE_LIMIT_REACHED",

  // Admin Actions
  ADMIN_USER_VIEW = "ADMIN_USER_VIEW",
  ADMIN_USER_EDIT = "ADMIN_USER_EDIT",
  ADMIN_USER_DELETE = "ADMIN_USER_DELETE",
  ADMIN_STATS_VIEW = "ADMIN_STATS_VIEW",

  // Security Events
  UNAUTHORIZED_ACCESS_ATTEMPT = "UNAUTHORIZED_ACCESS_ATTEMPT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum AuditSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

interface AuditLogEntry {
  timestamp: Date;
  action: AuditAction;
  severity: AuditSeverity;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  details?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLogEntry[] = [];
  private maxLogsInMemory = 1000;

  private constructor() {}

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an audit event
   */
  log(entry: Omit<AuditLogEntry, "timestamp">): void {
    const logEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date(),
    };

    // Add to in-memory store
    this.logs.push(logEntry);

    // Keep only the most recent logs in memory
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }

    // Log to console based on severity
    const logMessage = this.formatLogMessage(logEntry);

    switch (entry.severity) {
      case AuditSeverity.CRITICAL:
      case AuditSeverity.ERROR:
        console.error("[AUDIT]", logMessage, logEntry);
        break;
      case AuditSeverity.WARNING:
        console.warn("[AUDIT]", logMessage, logEntry);
        break;
      default:
        console.log("[AUDIT]", logMessage, logEntry);
    }

    // In production, send to external logging service
    this.sendToExternalService(logEntry);
  }

  /**
   * Format log message for display
   */
  private formatLogMessage(entry: AuditLogEntry): string {
    const { action, userId, userEmail, success } = entry;
    const user = userEmail || userId || "Anonymous";
    const status = success ? "SUCCESS" : "FAILED";
    return `[${status}] ${action} by ${user}`;
  }

  /**
   * Send log to external logging service
   * Implement this based on your logging provider
   */
  private sendToExternalService(_entry: AuditLogEntry): void {
    // TODO: Implement external logging service integration
    // Example with Logtail:
    // await logtail.log(_entry);
    //
    // Example with Sentry:
    // Sentry.captureMessage(this.formatLogMessage(_entry), {
    //   level: _entry.severity.toLowerCase(),
    //   extra: _entry,
    // });
  }

  /**
   * Get recent logs (for admin dashboard)
   */
  getRecentLogs(limit: number = 100): AuditLogEntry[] {
    return this.logs.slice(-limit).reverse();
  }

  /**
   * Get logs by user
   */
  getLogsByUser(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.userId === userId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get logs by action
   */
  getLogsByAction(action: AuditAction, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter((log) => log.action === action)
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear logs (use with caution)
   */
  clear(): void {
    this.logs = [];
  }
}

/**
 * Global audit logger instance
 */
export const auditLogger = AuditLogger.getInstance();

/**
 * Helper function to log user authentication events
 */
export function logAuth(
  action: AuditAction,
  userId: string | undefined,
  userEmail: string | undefined,
  success: boolean,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): void {
  auditLogger.log({
    action,
    severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
    userId,
    userEmail,
    ipAddress,
    userAgent,
    success,
    details,
  });
}

/**
 * Helper function to log subscription events
 */
export function logSubscription(
  action: AuditAction,
  userId: string,
  userEmail: string | undefined,
  success: boolean,
  details?: Record<string, any>
): void {
  auditLogger.log({
    action,
    severity: success ? AuditSeverity.INFO : AuditSeverity.ERROR,
    userId,
    userEmail,
    success,
    details,
  });
}

/**
 * Helper function to log AI generation events
 */
export function logAIGeneration(
  userId: string,
  success: boolean,
  details?: Record<string, any>,
  errorMessage?: string
): void {
  auditLogger.log({
    action: success
      ? AuditAction.AI_GENERATION_SUCCESS
      : AuditAction.AI_GENERATION_FAILED,
    severity: success ? AuditSeverity.INFO : AuditSeverity.WARNING,
    userId,
    success,
    details,
    errorMessage,
  });
}

/**
 * Helper function to log security events
 */
export function logSecurity(
  action: AuditAction,
  severity: AuditSeverity,
  ipAddress?: string,
  userAgent?: string,
  details?: Record<string, any>
): void {
  auditLogger.log({
    action,
    severity,
    ipAddress,
    userAgent,
    success: false,
    details,
  });
}

/**
 * Helper function to log admin actions
 */
export function logAdmin(
  action: AuditAction,
  adminId: string,
  adminEmail: string | undefined,
  resource?: string,
  details?: Record<string, any>
): void {
  auditLogger.log({
    action,
    severity: AuditSeverity.INFO,
    userId: adminId,
    userEmail: adminEmail,
    resource,
    success: true,
    details,
  });
}
