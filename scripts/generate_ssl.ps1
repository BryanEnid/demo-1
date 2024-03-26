# Create SSL directory if it doesn't exist
New-Item -ItemType Directory -Force -Path .\ssl

# Generate SSL certificate and key
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout .\ssl\key.pem -out .\ssl\cert.pem

Write-Host "SSL certificate and key generated successfully."
