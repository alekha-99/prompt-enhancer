# AWS ECS Free Tier Deployment Guide ☁️

This guide focuses on deploying `prompt-enhancer` to **AWS ECS** while strictly adhering to the **AWS Free Tier** limits.

> [!IMPORTANT]
> To stay within the Free Tier, we MUST use the **EC2 Launch Type** with a **t2.micro** instance.
> **DO NOT use AWS Fargate**, as it is NOT part of the standard always-free tier (though it has a small separate free trial allowance in some regions, EC2 is safer).

## Prerequisites

1.  **AWS Account** (Active Free Tier)
2.  **AWS CLI** installed and configured (`aws configure`)
3.  **Docker** installed and running

---

## Step 1: Create an ECR Repository (Free: 500MB/month)

1.  Go to **Amazon ECR** -> **Repositories** -> **Create repository**.
2.  Name: `prompt-enhancer`.
3.  Keep "Private" selected.
4.  Click **Create repository**.
5.  Select the repository and click **View push commands**. Follow the 4 commands to push your image:
    *   **Login**: `aws ecr get-login-password ...`
    *   **Build**: `docker build -t prompt-enhancer .`
    *   **Tag**: `docker tag prompt-enhancer:latest ...`
    *   **Push**: `docker push ...`

---

## Step 2: Create an ECS Cluster (EC2 backed)

1.  Go to **Amazon ECS** -> **Clusters** -> **Create cluster**.
2.  **Cluster Configuration**:
    *   Name: `prompt-enhancer-cluster`
    *   **Infrastructure**: Select **Amazon EC2 instances**.
3.  **EC2 Configuration** (CRITICAL FOR FREE TIER):
    *   **Operating System**: Amazon Linux 2 (or 2023).
    *   **EC2 instance type**: **t2.micro** (or t3.micro if your region allows).
        *   *Check your specific Free Tier eligibility. t2.micro is the standard.*
    *   **Desired capacity**: Min: 1, Max: 1.
4.  **Networking**:
    *   Create a new VPC or use default.
    *   **Auto-assign public IP**: Turned ON (so we can access it).
5.  Click **Create**.

---

## Step 3: Create a Task Definition

1.  Go to **Amazon ECS** -> **Task Definitions** -> **Create new Task Definition**.
2.  **Infrastructure**: **EC2** (NOT Fargate).
3.  **Container Details**:
    *   Name: `app`
    *   **Image URI**: Paste the ECR URI from Step 1 (e.g., `123456789.dkr.ecr.us-east-1.amazonaws.com/prompt-enhancer:latest`).
    *   **Port mappings**: Host Port: `80` (or 3000), Container Port: `3000`.
4.  **Environment Variables**:
    *   Key: `OPENAI_API_KEY`, Value: `sk-...`
    *   Key: `ANTHROPIC_API_KEY`, Value: `sk-...`
5.  **Task Memory**:
    *   Reserve something low like **512MiB** (t2.micro only has 1GB RAM total!).
    *   CPU: **256** (t2.micro has 1 vCPU).
6.  Click **Create**.

---

## Step 4: Create a Service

1.  Go to your Cluster (`prompt-enhancer-cluster`).
2.  Under **Services**, click **Create**.
3.  **Compute configuration**: **Launch type** -> **EC2**.
4.  **Deployment configuration**:
    *   **Application type**: Service.
    *   **Family**: Select the Task Definition you just created.
    *   **Desired tasks**: 1.
5.  **Load Balancing** (Optional - Adds complexity):
    *   You can skip this if you just want to access via the EC2 IP directly.
    *   *Note: Application Load Balancers (ALB) have a free tier of 750 hours, but cost money if you run more than one.*
6.  Click **Create**.

---

## Step 5: Access the App

1.  If you skipped the Load Balancer, find your **EC2 Instance** IP:
    *   Go to **EC2 Dashboard**.
    *   Find the instance named `ECS Instance...`.
    *   Copy the **Public IPv4 address**.
2.  Open browser: `http://<PUBLIC-IP>:80` (if you mapped Host Port 80 -> Container 3000).
    *   *Note: You may need to edit the EC2 Security Group to allow Inbound Traffic on Port 80 from Anywhere (0.0.0.0/0).*

## Troubleshooting

- **Memory Errors**: If the task stops immediately, check logs. Next.js can be memory hungry. Try increasing memory reservation to 700MiB, but don't exceed the t2.micro limit (1GB).
- **Security Group**: Ensure your EC2 Security Group allows TCP port 80 (HTTP) inbound.
