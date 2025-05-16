# EmailJS Setup Guide for Payslip Generator

This document provides detailed instructions for setting up EmailJS to work with the Payslip Generator application.

## 1. Create an EmailJS Account

1. Visit [EmailJS](https://www.emailjs.com/) and sign up for a free account
2. The free tier allows 200 emails per month, which should be sufficient for most small businesses

## 2. Add an Email Service

1. In your EmailJS dashboard, navigate to "Email Services" in the left sidebar
2. Click the "Add New Service" button
3. Select your preferred email provider (Gmail, Outlook, etc.)
4. Follow the authorization process to connect your email account
5. Name your service (e.g., "Payslip Service") and note the "Service ID" 
   - Example: `service_abc123`

## 3. Create an Email Template

1. Navigate to "Email Templates" in the left sidebar
2. Click "Create New Template"
3. In the Settings tab:
   - Give your template a name (e.g., "Payslip Template")
   - Note the "Template ID" (e.g., `template_xyz789`)

4. In the Content tab, create your email template. Here's an example:

**Subject line:**
```
{{subject}}
```

**Email content:**
```html
<h2>Payslip for {{employeeName}}</h2>

<p>Dear {{recipientEmail}},</p>

<p>{{message}}</p>

<p>Pay Period: {{payPeriod}}</p>

<p>Regards,<br>
{{senderName}}<br>
{{companyName}}</p>
```

5. **IMPORTANT:** In the Attachments tab:
   - Click "Add Attachment"
   - Select "Variable" as the attachment type
   - Set the variable name to `pdfData`
   - Set the filename to "Payslip.pdf"
   - Click "Save"

## 4. Get Your Public Key

1. Go to "Account" in the left sidebar
2. Navigate to the "API Keys" section
3. Copy your "Public Key" (it should look like `xYz_AbCdEfGh123456`)

## 5. Configure the Application

1. Create a file named `.env.local` in the root directory of your project with the following content:
```
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
```

2. Replace the placeholder values with your actual EmailJS credentials:
```
REACT_APP_EMAILJS_PUBLIC_KEY=xYz_AbCdEfGh123456
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
```

3. Restart your development server after updating the environment variables

## 6. Important Form Field Names

For the email to work correctly, ensure these form field names match exactly with your EmailJS template:

| Form Field Name | Description | Required |
|----------------|-------------|----------|
| `senderEmail` | The sender's email address | Yes |
| `senderName` | The sender's name | Yes |
| `recipientEmail` | The recipient's email address | Yes |
| `subject` | The email subject | Yes |
| `message` | The email message body | Yes |
| `employeeName` | The employee's name | Yes |
| `payPeriod` | The pay period | Yes |
| `companyName` | The company name | Yes |
| `pdfData` | The PDF attachment | Yes |

## Troubleshooting

If emails are not being sent, check the following:

1. **Check Browser Console for Errors:** 
   - Open your browser's developer tools (F12 or Ctrl+Shift+I)
   - Look for any error messages in the Console tab
   - Common errors include "unauthorized" (wrong credentials) or "missing parameter" (template variable issues)

2. **Verify Form Field Names:**
   - The form field names must exactly match the template variables
   - Check for typos or case differences (e.g., `senderEmail` vs `senderemail`)

3. **Test with Simple Email:**
   - Use the Email Test Panel in the application to send a simple test email
   - Check if the test email works while the main functionality doesn't

4. **Check EmailJS Dashboard:**
   - Go to your EmailJS dashboard > Email History
   - See if there are any attempted sends and what errors they have

5. **Attachment Issues:**
   - If the email sends but has no attachment, verify the attachment setup in your template
   - The PDF data might be too large (try with a smaller PDF)

6. **Template Preview:**
   - Use the template preview in EmailJS to verify your template looks correct

7. **Service Authentication:**
   - Check if your email service is still connected correctly
   - Some services (like Gmail) require periodic reauthorization

## Common Solutions

1. **"Missing Template" error:**
   - Double-check your template ID is correctly entered
   - Ensure your account has access to the template

2. **"Missing Parameter" error:**
   - One of your required variables is missing
   - Check all required fields are being passed properly

3. **Email sends but looks wrong:**
   - Preview your template in EmailJS
   - Make sure your HTML is correctly formatted

4. **API Key issues:**
   - Generate a new Public Key and update your application
   - Make sure you're initializing EmailJS before using it

## Testing Your Setup

Before using the application in production:

1. Fill out the payslip form with test data
2. Use a real email address you have access to for testing
3. Send a test email and verify it arrives with the correct content and PDF attachment
4. Check both the email content and the attachment to ensure everything works correctly

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Examples](https://www.emailjs.com/docs/examples/reactjs/)
- [EmailJS File Attachments Guide](https://www.emailjs.com/docs/user-guide/file-attachments/) 