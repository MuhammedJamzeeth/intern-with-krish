Service discovery by name (DNS inside Docker)

In the same network, containers can talk to each other using their service names (the ones you declare in docker-compose.yml).

Example:

Aggregation service calls http://rate-service:3000

No need to know the container’s IP (which changes).

Docker’s internal DNS resolves rate-service → its container IP.
