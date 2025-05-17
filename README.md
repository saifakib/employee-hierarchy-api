# Employee Hierarchy API - Backend Engineer Assessment

## Overview
This project implements a RESTful API for viewing employee hierarchies with JWT authentication and rate limiting. The solution includes:
- Employee hierarchy endpoint
- JWT authentication
- Rate limiting (throttling)
- Structured JSON logging
- Bootstrap UI
- Mock data implementation

## Features
- **API Endpoints**:
  - `POST /api/v1/auth/login` - Authenticate and get JWT token
     - Request body: `{ "username": "admin", "password": "admin" }`
  - `GET /api/v1/employees` - Get all employees
  - `GET /api/v1/employees/{id}/hierarchy` - Get employee hierarchy (requires auth)

- **Security**:
  - JWT authentication (1 hour expiry)
  - Rate limiting (100 requests per minute)
  - Global auth guard

- **Technical Implementation**:
  - NestJS framework
  - ThrottlerModule for rate limiting
  - Winston for structured JSON logging
  - Mock data (no database)
  - Bootstrap UI frontend

## Rate Limiting Configuration
The application implements request throttling with these settings:
```typescript
    ThrottlerModule.forRoot([{
    ttl: 60000, // 1 minute
    limit: 100, // Max 100 requests per minute
    }]),
```

## Getting Started

### Prerequisites
- Node.js v20+
- npm
- Docker and Docker Compose
- Git

### Installation

1.  **Clone the repository:**

```bash
git clone https://github.com/saifakib/employee-hierarchy-api.git
cd employee-hierarchy-api
```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    To stop the services:
    ```bash
    docker-compose down
    ```
3. **Open the UI: localhost:3000/index.html**
3. **Swagger: localhost:3000/api/v1/docs**

## Scaling to Thousands of Users

To scale this application to handle thousands of concurrent users:

1. **Database Implementation**:
   - Replace the in-memory repository with a proper database (PostgreSQL/MongoDB)
   - Add indexes on frequently queried fields (employeeId, managerId)
   - Implement database connection pooling

2. **Application Scaling**:
   - Deploy multiple instances behind a load balancer
   - Use PM2 or similar process manager to run multiple instances on a single server
   - Implement stateless design to allow for horizontal scaling

3. **Performance Optimization**:
   - Add Redis caching for frequently accessed hierarchies
   - Implement query optimization for hierarchy traversal
   - Use pagination for large result sets

4. **Rate Limiting and Protection**:
   - The application already includes rate limiting via ThrottlerModule
   - Add IP-based rate limiting for additional protection

## Logging & Monitoring at Scale

The application uses Winston for structured JSON logging. To scale this approach:

1. **Log Management**:
   - Ship logs to a centralized service like ELK Stack or Loggly
   - Implement log rotation to manage file sizes
   - Add request correlation IDs to track requests across the system

2. **Monitoring**:
   - Add health check endpoints (`/health`)
   - Implement metrics collection using Prometheus
   - Set up alerts for error rates, response times, and system resources

3. **Performance Tracking**:
   - Add custom metrics for business-critical operations
   - Track response times for hierarchy queries
   - Monitor memory usage, especially for large hierarchy traversals

## Deployment Instructions

To deploy this application to a production environment:

1. **Server Setup**:
   - Set up a Node.js environment (v18+) on your server
   - Install PM2 for process management: `npm install -g pm2`

2. **Application Deployment**:
   #### Clone the repository
    - git clone <https://github.com/saifakib/employee-hierarchy-api.git>
    - cd employee-hierarchy-api
   
   #### Install dependencies
   npm install --production
   
   #### Build the application
   npm run build
   
   #### Set up environment variables
   JWT_SECRET=your_production_secret
   
   #### Start with PM2
   pm2 start dist/main.js --name "employee-api" -i max
   
   #### Save PM2 configuration
   pm2 save
   
   #### Set up PM2 to start on system boot
   pm2 startup

3. **Reverse Proxy Setup** (using Nginx):
   - Install Nginx: `sudo apt install nginx`
   - Configure Nginx to proxy requests to your NestJS application
   - Set up SSL using Let's Encrypt

4. **Monitoring Setup**:
   - Configure PM2 monitoring: `pm2 monitor`
   - Set up log rotation: `pm2 install pm2-logrotate`