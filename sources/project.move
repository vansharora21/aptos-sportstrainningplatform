module SportsTrainingPlatform::Training {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct TrainingSession has store, key {
        total_staked: u64,
        reward_pool: u64,
    }

    /// Function to initialize a new training session
    public fun initialize_training_session(trainer: &signer) {
        // Register CoinStore for trainer
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(trainer))) {
            coin::register<AptosCoin>(trainer);
        };
        
        // Create new training session
        move_to(trainer, TrainingSession {
            total_staked: 0,
            reward_pool: 0,
        });
    }

    /// Function to register CoinStore for AptosCoin
    public fun register_coin_store(user: &signer) {
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(user))) {
            coin::register<AptosCoin>(user);
        };
    }

    /// Function to stake tokens for training
    public fun stake_tokens(user: &signer, trainer: address, amount: u64) acquires TrainingSession {
        // Register CoinStore for user if not already registered
        if (!coin::is_account_registered<AptosCoin>(signer::address_of(user))) {
            register_coin_store(user);
        };

        // Verify training session exists
        assert!(exists<TrainingSession>(trainer), 1);

        let session = borrow_global_mut<TrainingSession>(trainer);
        coin::transfer<AptosCoin>(user, trainer, amount);
        session.total_staked = session.total_staked + amount;
    }

    /// Function for trainers to claim rewards
    public fun claim_rewards(trainer: &signer) acquires TrainingSession {
        let trainer_addr = signer::address_of(trainer);
        let session = borrow_global_mut<TrainingSession>(trainer_addr);
        let reward = session.reward_pool;
        session.reward_pool = 0;

        coin::transfer<AptosCoin>(trainer, trainer_addr, reward);
    }
}
