import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
    })),
  },
}));

// Mock ENV
vi.mock("./_core/env", () => ({
  ENV: {
    smtpHost: "myicyemen.com",
    smtpPort: 465,
    smtpUser: "web_request@myicyemen.com",
    smtpPass: "web_request@24680",
    smtpTo: "website@myicyemen.com",
  },
}));

describe("sendContactNotification", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should send email with correct data", async () => {
    const { sendContactNotification } = await import("./email");
    const nodemailer = await import("nodemailer");
    const mockSendMail = vi.fn().mockResolvedValue({ messageId: "test-id" });
    (nodemailer.default.createTransport as any).mockReturnValue({
      sendMail: mockSendMail,
    });

    const result = await sendContactNotification({
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "777123456",
      subject: "استفسار عن التأمين",
      messageType: "inquiry",
      message: "أريد معرفة المزيد عن خدماتكم",
    });

    expect(result).toBe(true);
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "website@myicyemen.com",
        subject: expect.stringContaining("استفسار"),
        replyTo: "ahmed@example.com",
      })
    );
  });

  it("should return false when SMTP not configured", async () => {
    vi.doMock("./_core/env", () => ({
      ENV: {
        smtpHost: "",
        smtpPort: 465,
        smtpUser: "",
        smtpPass: "",
        smtpTo: "",
      },
    }));
    const { sendContactNotification } = await import("./email");
    const result = await sendContactNotification({
      name: "Test",
      email: "test@test.com",
      phone: "123",
      subject: "Test",
      messageType: "inquiry",
      message: "Test message",
    });
    expect(result).toBe(false);
  });
});
