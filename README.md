# Gamification Platform Readme

## Project Overview
Gamification of LMS

### Description

The platform allows instructors to create courses, define tasks for students, assign coins, maintain leaderboards, and set up a virtual shop where students can exchange earned coins for perks.

### Requirements

#### 1. Course-specific Data
- Each course using gamification has its own set of students, shop items, leaderboards, and point balances.

#### 2. User Types
- **Students:** View currency balance, submitted tasks, earned currency per task, leaderboards, and purchase perks.
- **Instructors:** Create/view courses, add students, define shop items with prices, add tasks and associated point values, and assign points to students.
- **Admins:** Can mangage instructor accounts.

#### 3. Automation
- Automatically generate course leaderboards when point values change.
- Automatically tally earned points, allowing students to purchase shop items if they have sufficient points.

#### 4. Notifications
- Notify instructors when a student purchases a shop item, including course name, student name, item bought, and purchase date/time.

#### 5. Efficient Point Entry
- Instructors can enter points for each student for a selected task on a single page without reloading or selecting different students.

#### 6. Visual Style
- Dark and 8-bit game graphics/pixel graphic theme.

### Usage

1. **User Authentication**
   - Students, instructors, and admins must have separate login credentials.

2. **Instructor Actions**
   - Instructors can create courses, manage students, define tasks, set point values, and add shop items.

3. **Student Dashboard**
   - Students can view their currency balance, submitted tasks, earned points, leaderboards, available shop items, and purchase perks.

4. **Admin Oversight**
   - Admins have access to all instructor actions and course information.

5. **Automation**
   - Leaderboards are automatically updated with changing point values.
   - Students can automatically purchase shop items when they have enough points.

6. **Notification System**
   - Instructors receive notifications when students purchase shop items.

7. **Efficient Point Entry**
   - Instructors can enter points for all students in a course on a single page without reloading.

### Visual Style

- The platform follows a dark and 8-bit game graphic/pixel graphic theme for a nostalgic and engaging user experience.



### Getting Started

- Will update later on

### Support and Issues

- [Provide information on how users can seek support or report issues]

### License

- MIT

### Additional Files

- Gdrive: https://drive.google.com/drive/folders/1p4_0ykX5mHCZsiVZFQhhoeFz82jUaslg?usp=drive_link

### Scrum Board 

- Taiga: https://tree.taiga.io/project/sergroup14-asugame/

## Installation Guide

1. Clone the GitHub repository

`git clone https://github.com/raumildhandhukia/CanvasGamificationTeam14.git`

2. Navigate to the `/front/react-ts` directory

`cd front/react-ts`

3. Install necessary packages required for the frontend

`npm install`

4. Start the React server

`npm start`

5. Make sure you are back in the project’s home directory 

`cd ../../`

6. Navigate to the /back directory

`cd /back`

7. Install the backend related libraries

`npm install`

8. Create a `.env` file in this directory (/back) and add the following to it

```
DB_URL=mongodb+srv://admin:admin@atlascluster.wzoqspj.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster
JWT_SECRET_KEY=team14@asu
SENDER_GMAIL=<YOUR_GMAIL_ADDRESS>
SENDER_GMAIL_APP_PASSWORD=<YOUR_GMAIL_APP_PASSWORD>
```
Note: In order to find your `GMAIL_APP_PASSWORD`, follow the below steps

8.1. Go to your [Google Account](https://myaccount.google.com/)

8.2. Search for “App Passwords” and select the first option

8.3. Choose an appropriate app name and copy the 16 digit code generated. 

8.4. Paste it as the SENDER_GMAIL_APP_PASSWORD env variable without any spaces

9. Run the backend server

`node index.js`

