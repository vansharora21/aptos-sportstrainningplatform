# Sports Training Platform

A decentralized sports training platform built on the Aptos blockchain that allows users to stake tokens for training sessions and trainers to manage rewards.

## Project Structure

- `sources/` - Contains the Move smart contracts
- `templates/` - Contract templates
- `tests/` - Test files
- `scripts/` - Utility scripts
- `aptos-backend/` - Backend service
- `aptos-training-frontend/` - Frontend application
- `server/` - Server configuration

## Smart Contract Features

- Token staking for training sessions
- Reward management for trainers
- Secure coin transfers
- Training session tracking

## Getting Started

1. Install dependencies:
```bash
aptos move compile
```

2. Deploy the contract:
```bash
aptos move publish
```

3. Initialize a training session:
```bash
aptos move run --function-id <your-address>::Training::initialize_training_session
```

## Frontend

The frontend application is built with modern web technologies and can be found in the `aptos-training-frontend/` directory.

## Backend

The backend service is located in the `aptos-backend/` directory and handles the business logic and API endpoints.

## License

MIT 