#!/bin/bash
# save as: start-local.sh

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop positivus || true
docker rm positivus || true

# Build new image
echo "🏗️  Building Docker image..."
docker build -t positivus .

# Run container
echo "🚀 Starting container..."
docker run -d \
  --name positivus \
  --restart unless-stopped \
  -p 8080:80 \
  positivus

# Check status
echo "✨ Container status:"
docker ps | grep positivus

echo "🌎 App is running at http://localhost:8080"