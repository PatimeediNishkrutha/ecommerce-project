#!/bin/bash

echo "Starting deployment..."

cd /home/ubuntu/deploy

echo "Building backend Docker image..."
sudo docker build -t ecommerce-backend ./ebackend

echo "Stopping old backend container..."
sudo docker stop ecommerce-backend 2>/dev/null || true
sudo docker rm ecommerce-backend 2>/dev/null || true

echo "Starting backend container..."
sudo docker run -d \
  --name ecommerce-backend \
  --env-file ./ebackend/.env \
  -p 5000:5000 \
  ecommerce-backend

echo "Building frontend Docker image..."
sudo docker build -t ecommerce-frontend ./ecommerce

echo "Stopping old frontend container..."
sudo docker stop ecommerce-frontend 2>/dev/null || true
sudo docker rm ecommerce-frontend 2>/dev/null || true

echo "Starting frontend container..."
sudo docker run -d \
  --name ecommerce-frontend \
  -p 3000:80 \
  ecommerce-frontend

echo "Deployment completed successfully"