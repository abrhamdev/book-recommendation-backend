# NovaReads – Backend

NovaReads is a scalable book recommendation system built with a microservices architecture, offering personalized book suggestions, engaging book clubs, and timely notifications. Core services include User, Book, Community, Notification, Recommendation, and Admin, delivering a flexible and modular platform for book discovery and community interaction.

## Core services include:

- User Service
- Book Service
- Community Service
- Notification Service
- Recommendation Service (Flask ML API)
- Admin Panel

## Overview

### This project addresses common challenges:

- Difficulty in finding books tailored to individual tastes
- Lack of engaging book club interactions
- Absence of personalized recommendations

### NovaReads solves these by providing:

1. Customized reading suggestions
2. Community engagement through book clubs
3. Timely notifications

## Features

1. User Service – Secure registration (JWT + Google OAuth)
2. Book Service – Search and discovery by genre
3. Community Service – Book club discussions
4. Notification Service – Timely notifications
5. Recommendation Service – Personalized book suggestions

## Tech Stack

- Backend: Node.js (Express), Flask (Python)
- Databases: MySQL, MongoDB
- Messaging: Kafka

## Getting Started
1. Fork the repository
   ```bash
   git fork https://github.com/abrhamdev/book-recommendation-backend.git
2. Install dependencies for each service
   ```bash
   cd user-service && npm install
   cd book-service && npm install
   # Repeat for other services
3. Configure environment variables
  ``` Create a .env file in each service with required configurations. ```

4. Run services
- Using Docker Compose (recommended):
      
    ```bash
      docker-compose up --build
      # but first you need to setup docker
- Or run manually:
   
    ```bash
       npm run dev
       # in each service
 
## Contributing

Contributions are welcome!

- Fork the repository
- Create a feature branch 
- Submit a pull request
