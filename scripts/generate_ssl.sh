#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p "ssl"

# Generate SSL certificate and key
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout "ssl/key.pem" -out "ssl/cert.pem"

echo "SSL certificate and key generated successfully."
