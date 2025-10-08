# Stage 1: Builder
# Use a Python base image with a specific version
FROM python:3.10-slim-buster as builder

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory inside the container
WORKDIR /app

# Install build dependencies (e.g., for some pip packages that require C compilers)
# Uncomment and customize if needed by your project's dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
#     && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
# Use --no-cache-dir to prevent pip from storing downloaded packages, reducing image size
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production/Runtime
# Use the same Python base image for consistency, or a smaller one if possible (e.g., alpine variant if compatible)
FROM python:3.10-slim-buster

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set the working directory inside the container
WORKDIR /app

# Copy the installed Python dependencies from the builder stage
# This ensures all packages and their executables are available
COPY --from=builder /usr/local /usr/local

# Copy the rest of the application code
COPY . .

# Expose the port if your application is a web service (e.g., Flask, FastAPI)
# Uncomment and change if your application listens on a specific port
# EXPOSE 8000

# Define the command to run the application
# This assumes your main application script is 'main.py' in the root of your project
# If it's a web server, you might use Gunicorn or Uvicorn:
# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]
CMD ["python", "main.py"]