# Vaccine Checker App

This is a web application built with Node.js and Express.js to help users check for vaccine availability in their area. It provides features for users to subscribe to email notifications for vaccine availability and to unsubscribe from these notifications. It also includes an admin panel to send email alerts about available vaccines to subscribed users.

## Features

- **User Subscription:** Users can subscribe to receive email notifications about vaccine availability based on their age group, state, and district.
- **Email Notifications:** Automatic email notifications are sent to subscribed users when vaccines become available in their specified district.
- **Unsubscription:** Users can unsubscribe from receiving further email notifications.
- **Admin Panel:** Admins can send email alerts about vaccine availability to all subscribed users in a particular district.
- **Database Integration:** Data is stored in a MySQL database to manage user subscriptions and vaccine availability information.
- **Responsive Design:** The web application is designed to be mobile-friendly and accessible on various devices.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AviMehta90/vaccine-availability.git
   ```

2. Install dependencies:

   ```bash
   cd vaccine-availability
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and provide the following variables:

   ```plaintext
   PORT=3000
   EMAIL=your-email@gmail.com
   PASSWORD=your-email-password
   ```

   Make sure to replace `your-email@gmail.com` and `your-email-password` with your actual Gmail credentials.

4. Set up MySQL database:

   - Ensure MySQL is installed on your system.
   - Modify the `connection` object in `app.js` to connect to your MySQL database.
   - Run the provided SQL script `vaccine.sql` to create the necessary tables.

5. Run the application:

   ```bash
   npm start
   ```

6. Access the application in your web browser at `http://localhost:3000`.

## Usage

- Visit the homepage to subscribe to vaccine availability notifications by providing your email, age group, state, and district.
- Admins can access the admin panel by navigating to `/admin`.
- To send email alerts to users in a specific district, provide the required details in the admin panel and click "Send Alert".
- Users can unsubscribe from notifications by visiting `/unsubscribe` and providing their email address.

## Contributing

Contributions are welcome!
