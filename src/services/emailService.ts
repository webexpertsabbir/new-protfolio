import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_76fwtld";
const TEMPLATE_ID = "template_5hjl8sg";
const PUBLIC_KEY = "8cuzuhLX4FAUmIj1T";

interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (params: EmailParams) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name: params.name,
        email: params.email,
        subject: params.subject,
        message: params.message,
      },
      PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw error;
  }
};
