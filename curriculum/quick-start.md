# Hanzo University: Quick Start

Ready to launch your first agent? Follow these steps to get started with the Hanzo OS Stack.

## Prerequisites
- Access to the Hanzo Stack environment.
- `hanzo` CLI installed.
- Access to `hanzo.market` account.

## Steps
1. **Initialize the Environment**
   ```bash
   hanzo init
   ```
2. **Launch the Stack**
   ```bash
   hanzo up
   ```
3. **Launch Your First Agent**
   - Choose a CRM template: `job`, `trade`, or `content-creator`.
   - Run the setup for your chosen template (e.g., for Job CRM):
     ```bash
     hanzo template install job-crm
     hanzo run job-crm --verify
     ```
4. **Certification**
   - Once your agent is active and successfully processing data, navigate to `hanzo.market` to verify your deployment and earn your certificate.
