# TurboVets RBAC System

The **TurboVets RBAC System** is a streamlined **Role-Based Access Control (RBAC)** API built specifically for a veteran healthcare application. Developed using a modern tech stack—**NestJS**, **TypeScript**, **TypeORM**, and **SQLite**—this repository demonstrates a secure, hierarchical access control system with clear modular architecture, comprehensive testing strategies, and integrated audit logging for critical operations. This system serves as a robust, scalable foundation, clearly highlighting best practices for permission management and data security in healthcare-oriented applications.

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/nkchebat/TurboVetsTechAssessment.git
cd rbac-api
npm install
```

### 2. Start the Server

```bash
npm run start:dev
```

**Server URL:** `http://localhost:3000`

### 3. Run Unit Tests

- **Unit tests:**

```bash
npm run test
```

- **End-to-end (e2e) tests:**

```bash
npm run test:e2e
```

### 4. Use Thunder Client for Endpoint Testing

Import the `TurboVets_API_Collection.json` provided into Thunder Client (VS Code) to test endpoints easily.

---

## API Documentation

| Method | Endpoint         | Roles Allowed           | Description                            |
|--------|------------------|-------------------------|----------------------------------------|
| POST   | `/orgs`          | Admin                   | Create a new organization              |
| GET    | `/orgs`          | Admin                   | List all organizations                 |
| POST   | `/users`         | Admin                   | Create a new user                      |
| GET    | `/users`         | Any                     | List all users                         |
| POST   | `/records`       | Owner, Admin            | Create a patient record                |
| GET    | `/records`       | Owner, Admin, Viewer    | View accessible patient records        |
| GET    | `/records/:id`   | Owner, Admin, Viewer    | View specific patient record           |
| PATCH  | `/records/:id`   | Owner, Admin            | Update patient record                  |

---

## Data Model

- **Organization**:
  - `id`: number
  - `name`: string
  - `parent`: optional reference to another Organization
  - Supports a simple hierarchy (max 2 levels: parent → child)
  - **Note**: Access control is limited to a user's own org. Users in sibling or parent orgs **do not** have inherited access.

- **User**:
  - `id`: number
  - `name`: string
  - `email`: string
  - `role`: `'Admin' | 'Owner' | 'Viewer'`
  - Linked to one Organization

- **PatientRecord**:
  - `id`: number
  - `name`: string
  - `diagnosis`: string
  - Linked to one Owner (`User`)
  - Linked to one Organization

---

## Access Control Logic

| Role   | Own Records | Same Org Records | Edit Privileges |
|--------|-------------|-------------|-----------------|
| Owner  | ✅          | ❌          | ✅              |
| Admin  | ✅          | ✅          | ✅              |
| Viewer | ✅          | ✅          | ❌              |

> **Note on Hierarchy**: Organizations can have a simple two-level hierarchy (parent and child).  
> However, access to "Org Records" is **strictly limited to a user's own organization**.  
> - Admins and Viewers in a **sibling org** (i.e., different child orgs under the same parent) **cannot** access each other’s records.  
> - Parent orgs **do not inherit** access to child org records, and vice versa.


### Audit Logging

Audit logging allows for a historical record to be created whenever a user performs a significant action in the system. This includes events such as creating organizations, adding users, and modifying patient records.

Each audit log includes contextual details—such as who performed the action, what was changed, when it occurred, and which resource was affected. In this system, audit logs are output to the server console to simulate how logs might be collected in a real production environment (e.g., sent to a logging service like Datadog or stored in an audit table).

```bash
[AUDIT] Created record for John Doe {
  diagnosis: "Anxiety",
  orgId: 1,
  ownerId: 1,
  timestamp: "2025-05-24T02:20:15Z"
}
```

---

## Testing Strategy

This project includes a robust testing suite that verifies both the internal logic and the real-world behavior of the application.

### Unit Tests (Jest):
Unit tests are written for:

- **Controllers**: Ensuring each endpoint behaves as expected and properly delegates to services.
- **Services**: Validate logic around creating, updating, and fetching records, as well as filtering visibility based on the user's role and organization.
- **Access Control Logic**: The `canAccess()` method is thoroughly tested for all role and ownership scenarios, including both valid and denied access.

These tests use mocked dependencies to isolate the logic under test, making them fast and reliable. All unit tests are run using the standard command:

```bash
npm run test
```

### End-to-End (E2E) Tests (Supertest)

A dedicated e2e test validates the actual behavior of the API in a fully initialized environment. It verifies:

- The ability to create users and organizations
- The creation of a patient record by an authorized user
- The returned response contains correct organization and ownership references

These tests use Supertest to simulate real HTTP requests against the running server, mimicking how a client would interact with the API. To run them use the 
command:

```bash
npm run test:e2e
```

Together, these tests demonstrate that the system works as expected under both isolated and integrated conditions, covering all the critical RBAC logic.
---

## Future Considerations

This implementation lays the groundwork for a secure and maintainable RBAC system. In a production environment or with additional development time, the following areas could be expanded:

### Extendability

- Deep Organizational Hierarchies: Currently, the system supports only a two-level org structure (parent-child). In real-world applications, a recursive hierarchy (e.g., regional → hospital → department) with inherited permissions may be required.

- Delegated Access: Support for temporary or limited delegation (e.g., "Dr. Smith can access these records for 2 days") would enhance flexibility in clinical workflows.

- Role Inheritance & Custom Roles: Allowing roles to inherit permissions or defining fine-grained custom roles would offer greater control over edge cases and evolving team structures.

### Security Considerations

- Authentication: Integrating proper authentication (e.g., JWT or OAuth2) would replace the simulated middleware and ensure secure, user-specific sessions.

- Input Validation and Sanitization: Stronger validation (e.g., using class-validator) should be applied to all request bodies to protect against injection attacks and malformed input.

- Secure Headers and HTTPS: In production, serving over HTTPS with strict CORS policies and secure HTTP headers would be mandatory.

- Audit Persistence: Current audit logs are printed to the console. These should be written to a persistent and tamper-evident logging service (e.g., a write-once table, external service like Datadog or ELK stack).

### Performance Optimizations

- Database Indexing: Adding indexes on foreign keys (e.g., organizationId, ownerId) and frequently queried fields would significantly speed up permission checks.

- Query Optimization: Instead of eager loading all relations, lazy loading or carefully selected joins can reduce overhead.

- Caching: Common queries (e.g., GET /records for a given user) could be cached using Redis or in-memory stores to reduce DB load in high-traffic environments.

### Additional Features

- Soft Deletes: Instead of permanently deleting records, implementing soft deletes allows better traceability and recovery in healthcare environments.

- Admin Dashboards: Building a frontend UI for managing users, organizations, and permissions would make the system usable by non-technical administrators.

- Audit Dashboard: Visualizing historical actions (record updates, user changes) would provide valuable insight for compliance and internal reviews.

- Pagination & Filtering: For large datasets, endpoints like GET /records should support pagination, filtering, and sorting to improve client performance and usability.
---

