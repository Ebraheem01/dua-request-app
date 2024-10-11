# Dua Request App - To Do List

## 1. Setup and Configuration
- [x] Initialize Next.js project.
- [x] Integrate Clerk for authentication.
  - [x] Configure signup, login, and profile management.
- [x] Set up MongoDB with Mongoose.
  - [x] Create a `duas` collection.
  - [x] Create a `users` collection to link requests to users.
- [x] Deploy the app on Vercel.

## 2. Features

### Dua Requests
- [x] Build a form for users to request a Dua.
  - [x] Fields: User ID (linked to Clerk), Dua title, description, category (optional), status.
  - [x] Save Dua requests to MongoDB.
  
### Community Interaction
- [x] Display a list of public Dua requests.
  - [x] Allow users to filter by categories (e.g., Health, Success, Spirituality).
  - [x] Add search functionality.
  - [x] Allow users to support duas
  - [x] Enable users to comment on Duas.
  - [] Allow users to sort Duas by date, support count, or popularity.
  
### User Profile
- [x] Allow users to view their own submitted Duas.
- [ ] Provide status updates (e.g., pending, answered).
- [ ] Enable users to make Duas public or private.

### Admin Panel (Optional)
- [ ] Create admin roles to approve or moderate Dua requests.
- [ ] Allow admins to manage flagged content or user reports.

## 3. UI/UX
- [ ] Design the homepage to showcase recent or popular Duas.
- [ ] Implement a notification system (e.g., email or in-app) for Dua request updates.
- [ ] Add a button for users to submit their own Duas.

## 4. Enhancements (Future)
- [ ] Implement a voting or reaction system to show community support for certain Duas.
- [ ] Add a comment section for users to leave supportive messages.
- [ ] Allow users to "favorite" or bookmark Duas.
- [ ] Add a sharing feature for social media.
- [ ] Implement localization (multi-language support).

## 5. Testing & Deployment
- [ ] Write unit and integration tests for key features.
- [ ] Perform user acceptance testing (UAT).
- [ ] Deploy the app to Vercel.
- [ ] Monitor app for errors and performance.

## 6. Marketing (Optional)
- [ ] Create a landing page to promote the app.
- [ ] Set up social media accounts and integrate them with the app.
