# Prisma | Plugin

Create a modern SaaS AI learning platform inspired by the visual style of sanalabs.com. 

The design should be very clean, modern, and minimal, similar to a high-end SaaS product.

The platform must include both frontend and backend functionality.

GENERAL ARCHITECTURE

Build it as a multi-tenant SaaS platform where multiple companies can use the same system.

Entities:

- Platform Admin

- Companies

- Company Admins

- Users (employees / learners)

- Courses

- Learning Modules

- Quizzes

- Progress tracking

AUTHENTICATION

Include authentication with:

- login

- signup

- password reset

- role-based access

Roles:

- Super Admin (platform owner)

- Company Admin

- User / Learner

DASHBOARDS

Super Admin dashboard:

- manage companies

- manage global users

- view analytics

- create or delete companies

- monitor platform usage

Company Admin dashboard:

- manage their company profile

- upload logo

- define brand colors

- invite users

- manage courses

- assign courses to users

- see learning progress

- see quiz results

User dashboard:

- view assigned courses

- continue learning

- take quizzes

- see learning progress

- certificates / completion status

E-LEARNING FEATURES

Courses should contain:

- video lessons

- text lessons

- downloadable files

- quizzes

- completion tracking

Allow company admins to:

- create courses

- upload videos or materials

- structure modules

- create quizzes

- assign courses to users or teams

QUIZ SYSTEM

Allow creation of:

- multiple choice quizzes

- true/false

- short answers

Track:

- score

- completion

- attempts

BRANDING PER COMPANY

Each company should be able to customize:

- company logo

- primary color

- secondary color

- company name

- welcome message

These settings should dynamically change the UI for their users.

DESIGN

Use a modern SaaS design inspired by sanalabs.com:

- lots of white space

- soft shadows

- rounded UI components

- modern typography

- dashboard cards

- minimal layout

Use a layout similar to modern AI SaaS platforms:

- left sidebar navigation

- top bar with user profile

- card-based dashboard

MAIN SECTIONS

Sidebar navigation should include:

- Dashboard

- Courses

- Learning Programs

- Quizzes

- Users

- Analytics

- Settings

DATABASE STRUCTURE

Create tables for:

- companies

- users

- roles

- courses

- modules

- quizzes

- quiz_questions

- quiz_results

- enrollments

- progress_tracking

- company_brand_settings

Make sure relationships allow each company to only see their own data.

UI PAGES

Create pages for:

- login

- signup

- dashboard

- course library

- course viewer

- quiz player

- admin user management

- company settings

- branding customization

The result should look like a modern enterprise learning SaaS similar to Sana Labs but simplified for an MVP.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://plugin-prisma.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/62c9d9fb-4c77-4f7b-9bba-a163f84c5ea2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
