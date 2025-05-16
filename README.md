# Payslip Generator

A professional payslip generator built with React and Tailwind CSS that allows you to create, customize, download, print, and email payslips for your employees.

## Features

- **Company Information Management**: Add company details including name, address, and logo
- **Employee Details**: Record employee name, ID, pay period, pay date, and more
- **Earnings & Deductions**: Easily add and modify multiple earnings and deductions
- **Dynamic Calculation**: Automatic calculation of gross earnings, total deductions, and net pay
- **Professional PDF Generation**: Create professional-looking payslips with customizable themes
- **Template Management**: Save and load payslip templates for recurring use
- **Multiple Output Options**:
  - Download as PDF
  - View PDF in browser
  - Print directly
  - Email to employees (simulation)
- **Customization Options**:
  - Choose from multiple PDF themes (Classic Blue, Modern Green, Elegant Purple, Corporate Gray)
  - Customize generated PDF appearance

## Technology Stack

- React for UI components
- Tailwind CSS for styling
- jsPDF for PDF generation
- LocalStorage for template storage

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/payslip-generator.git
   cd payslip-generator
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Usage Guide

### Creating a Payslip

1. **Add Company Information**
   - Enter company name, address, and other details
   - Upload company logo (optional)

2. **Add Employee Details**
   - Enter employee name, ID, and pay period
   - Set paid days and pay date

3. **Add Earnings and Deductions**
   - Add one or more earnings (Basic Salary, HRA, etc.)
   - Add one or more deductions (Tax, Insurance, etc.)
   - View automatically calculated totals

4. **Preview and Generate Payslip**
   - View the summary information
   - Choose a theme for the PDF
   - Generate the payslip using one of the output options

### Working with Templates

1. **Saving Templates**
   - Fill in company information and standard earnings/deductions
   - Click "Save Template" and give it a name
   - Templates save company info, earnings, and deductions structure

2. **Loading Templates**
   - Click "Load Template"
   - Select a previously saved template
   - Fill in employee-specific information

## Customization

### PDF Themes

The application provides multiple themes for PDF generation:

- **Classic Blue**: Professional blue theme suitable for most organizations
- **Modern Green**: Fresh green theme with a modern look
- **Elegant Purple**: Sophisticated purple theme for a premium feel
- **Corporate Gray**: Formal grayscale theme for corporate organizations

## Setup Email Functionality

This application uses EmailJS to send emails with PDF attachments. To set up the email functionality:

1. **Create an EmailJS Account**
   - Sign up for a free account at [EmailJS](https://www.emailjs.com/)
   - After signing up, go to your dashboard

2. **Add an Email Service**
   - In your EmailJS dashboard, go to "Email Services"
   - Click "Add New Service" and select your email provider (Gmail, Outlook, etc.)
   - Follow the prompts to connect your email account
   - Copy the "Service ID" for later use

3. **Create an Email Template**
   - In your EmailJS dashboard, go to "Email Templates"
   - Click "Create New Template"
   - Design your template with the following variables:
     - `senderEmail` - Used for the From field
     - `senderName` - The name of the sender
     - `recipientEmail` - The email address where to send the payslip
     - `subject` - The email subject
     - `message` - The email message body
     - `employeeName` - The employee's name (for the message)
     - `payPeriod` - The pay period (for the message)
     - `companyName` - The company name (for the message)
     - `pdfData` - The PDF data to be attached
   - Ensure you set up the attachment correctly:
     - Go to the "Attachments" tab in your template editor
     - Add a new attachment with the "Variable" option
     - Set the variable name to "pdfData" 
     - Set a filename like "Payslip.pdf"
   - Copy the "Template ID" for later use

4. **Get Your Public Key**
   - In your EmailJS dashboard, go to "Account" > "API Keys"
   - Copy your "Public Key"

5. **Update the Application Code**
   - Open `src/App.jsx` and replace 'YOUR_PUBLIC_KEY' with your actual Public Key:
     ```jsx
     emailjs.init({
       publicKey: 'YOUR_PUBLIC_KEY', // Replace with your actual Public Key
     });
     ```
   - Open `src/components/PaySlipResult.jsx` and update the service and template IDs:
     ```jsx
     const response = await emailjs.sendForm(
       'service_payslip', // Replace with your actual EmailJS service ID
       'template_payslip', // Replace with your actual EmailJS template ID
       emailFormRef.current
     );
     ```

Once these steps are completed, you'll be able to send payslips directly from the application via email!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and Tailwind CSS communities
- jsPDF library contributors
- All contributors to this project

---

Feel free to contribute to this project by submitting pull requests or reporting issues!
