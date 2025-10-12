# Stage 1: Builder
# Use a Python base image with a specific version to ensure consistency
FROM python:3.10-slim-buster as builder

# Set environment variables for Python to improve performance and logging
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory inside the container
WORKDIR /app

# Install system-level build dependencies required by many Python packages (e.g., C extensions for cryptography, psycopg2)
# Rationale: Ensures common C-based dependencies for pip packages are available during build.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    # Add any other build deps here, e.g., for image processing, specific databases
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the requirements file early to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
# Use --no-cache-dir to prevent pip from storing downloaded packages, reducing image size
# Use --upgrade pip to ensure the latest pip version is used
# Install wheel for faster installation of binary packages
RUN pip install --upgrade pip wheel
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production/Runtime
# Use the same Python base image for consistency and to avoid potential ABI incompatibilities
FROM python:3.10-slim-buster

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory inside the container
WORKDIR /app

# Install runtime dependencies. These are often smaller than build dependencies.
# Rationale: Reduce final image size by only including what's needed at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    # Add any other runtime deps here, e.g., for image processing, specific databases
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the installed Python dependencies from the builder stage
# This ensures all packages and their executables are available without re-installing.
# Rationale: Leverages multi-stage build to separate build-time and run-time concerns.
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the rest of the application code
COPY . .

# Create a non-root user and group to run the application for security best practices.
# Rationale: Running as non-root minimizes potential security vulnerabilities.
RUN groupadd --system appgroup && useradd --system --gid appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

# Expose the port where the application will listen
# Rationale: Informs Docker that the container listens on this port.
EXPOSE 8000

# Define the command to run the application using Gunicorn and Uvicorn workers.
# This provides a robust, production-ready ASGI server for FastAPI.
# -w 4: Spawns 4 worker processes. Adjust based on CPU cores (2*CPU + 1 is a common heuristic).
# -k uvicorn.workers.UvicornWorker: Specifies Uvicorn as the ASGI worker class.
# -b 0.0.0.0:8000: Binds the server to all network interfaces on port 8000.
# main:app: Assumes your FastAPI application instance is named 'app' in 'main.py'.
# Rationale: Standard production setup for FastAPI using Gunicorn as a process manager for Uvicorn.
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]