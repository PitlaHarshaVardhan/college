# Deployment Guide (AWS EC2 - Free Tier)

This guide provides beginner-friendly, step-by-step instructions to deploy the Leave Management System on a Free Tier AWS EC2 instance.

## ☁️ 1. Infrastructure Preparation

### Step 1.1: Launch an EC2 Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2 > Instances** and click **Launch Instance**.
3. **Name**: `LMS-Server`
4. **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible).
5. **Instance Type**: t2.micro (Free tier eligible).
6. **Key Pair**: Create a new key pair (RSA, .pem), download it safely (e.g., `lms-key.pem`).
7. **Network Settings**:
   - Check "Allow SSH traffic from Anywhere"
   - Check "Allow HTTP traffic from the internet"
   - Check "Allow HTTPS traffic from the internet"
8. Click **Launch Instance**.

### Step 1.2: Prepare MongoDB Atlas
Since we are using the Free Tier, running MongoDB locally on a t2.micro can consume too much RAM. We recommend using MongoDB Atlas.
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add IP `0.0.0.0/0` (Allow access from anywhere).
3. Go to **Database Access** and create a user and password.
4. Get your connection string (URI) from **Connect > Connect your application**.

---

## 🚀 2. Server Setup

### Step 2.1: Connect via SSH
Open your terminal (Mac/Linux) or Command Prompt/PowerShell (Windows):
```bash
# Set proper permissions for the key (Mac/Linux only)
chmod 400 lms-key.pem

# Connect to the instance
ssh -i "lms-key.pem" ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### Step 2.2: Install Dependencies (Node.js & Nginx)
Run the following commands on your EC2 instance:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx (Reverse Proxy)
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Install PM2 (Production Process Manager for Node.js)
sudo npm install -g pm2
```

---

## 📦 3. Application Deployment

### Step 3.1: Clone and Setup Backend
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd leave-management-system/backend

# Install backend dependencies
npm install

# Create environment file
nano .env
```

Paste your production variables:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
JWT_SECRET=<GENERATE_A_STRONG_RANDOM_STRING>
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1
# The URL where your frontend will be accessible
CLIENT_URL=http://<YOUR_EC2_PUBLIC_IP>
```
Press `Ctrl+O`, `Enter`, `Ctrl+X` to save and exit.

Start the backend with PM2:
```bash
pm2 start server.js --name "lms-backend"
pm2 save
pm2 startup
```

### Step 3.2: Build the Frontend
```bash
cd ../frontend

# Create environment file for frontend
nano .env
```
Add the production API URL (your EC2 IP or Domain):
```env
VITE_API_URL=http://<YOUR_EC2_PUBLIC_IP>/api
```

Build the Vue app:
```bash
npm install
npm run build
```
This generates a `dist` folder containing static HTML, CSS, and JS files.

Copy the `dist` folder to Nginx's serving directory:
```bash
sudo cp -r dist/* /var/www/html/
```

---

## 🌐 4. Nginx Configuration

We need Nginx to serve the static frontend files and proxy `/api` requests to our Node.js backend running on port 5000.

```bash
sudo nano /etc/nginx/sites-available/default
```

Replace the contents with:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    server_name _;

    # Serve Vue Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 🎉 5. Success!
Open your browser and navigate to `http://<YOUR_EC2_PUBLIC_IP>`. You should see the Leave Management System running perfectly!
