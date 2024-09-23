<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    import { apiRequest } from '../utils/api';
    
    interface Reward {
        rewardid: number;
        type: string;
        name: string;
        description: string;
        rarity: string;
    }

    interface PackReward extends Reward {
        packType: string;
    }

    interface CoinReward extends Reward {
        amount: number;
    }

    interface XPReward extends Reward {
        amount: number;
    }

    interface TrophyReward extends Reward {
        trophyType: string;
    }

    interface Objective {
        id?: number;
        name: string;
        description: string;
        groupId: number | null;
        rewardId: number | null;
    }

    let rewards: Reward[] = [];
    let newReward: Partial<Reward & PackReward & CoinReward & XPReward & TrophyReward> = { 
        type: '', 
        name: '', 
        description: '', 
        rarity: '' 
    };

    const rewardTypes = ['Pack', 'Coins', 'XP', 'Trophy'];
    let objectives: Objective[] = [];
    let newObjective: Objective = { name: '', description: '', groupId: null, rewardId: null };
    let isAdmin = false;
    let isLoading = true;
    
    onMount(() => {
        const unsubscribe = auth.subscribe(user => {
            isAdmin = user?.isadmin || false;
            isLoading = false;
            if (!isLoading && isAdmin) {
                fetchObjectives();
            } else if (!isLoading && !isAdmin) {
                navigate('/');
            }
        });

        return unsubscribe;
    });

    async function fetchRewards() {
        const response = await apiRequest('/api/rewards');
        if (response.ok) {
            rewards = await response.json();
        } else {
            console.error('Failed to fetch rewards');
        }
    }

    async function createReward() {
        const response = await apiRequest('/api/rewards', {
            method: 'POST',
            body: JSON.stringify(newReward)
        });
        if (response.ok) {
            await fetchRewards();
            newReward = { type: '', name: '', description: '', rarity: '' };
        } else {
            alert('Failed to create reward');
        }
    }
    
    async function fetchObjectives() {
        const response = await fetch('/api/objectives');
        if (response.ok) {
            objectives = await response.json();
        } else {
            console.error('Failed to fetch objectives');
        }
    }

    async function createObjective() {
        const response = await fetch('/api/objectives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newObjective)
        });
        if (response.ok) {
            await fetchObjectives();
            newObjective = { name: '', description: '', groupId: null, rewardId: null };
        } else {
            alert('Failed to create objective');
        }
    }
    $: showPackFields = newReward.type === 'Pack';
    $: showCoinFields = newReward.type === 'Coins';
    $: showXPFields = newReward.type === 'XP';
    $: showTrophyFields = newReward.type === 'Trophy';

    function getRewardDetails(reward: Reward): string {
        switch (reward.type) {
            case 'Pack':
                return `Pack Type: ${(reward as PackReward).packType}`;
            case 'Coins':
            case 'XP':
                return `Amount: ${(reward as CoinReward | XPReward).amount}`;
            case 'Trophy':
                return `Trophy Type: ${(reward as TrophyReward).trophyType}`;
            default:
                return '';
        }
    }
</script>

{#if isLoading}
    <p>Loading...</p>
{:else if isAdmin}
    <h1>Admin Panel</h1>
    <h2>Manage Rewards</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Description</th>
                <th>Rarity</th>
                <th>Details</th>
            </tr>
        </thead>
        <tbody>
            {#each rewards as reward}
                <tr>
                    <td>{reward.rewardid}</td>
                    <td>{reward.type}</td>
                    <td>{reward.name}</td>
                    <td>{reward.description}</td>
                    <td>{reward.rarity}</td>
                    <td>{getRewardDetails(reward)}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <h3>Create New Reward</h3>
    <form on:submit|preventDefault={createReward}>
        <select bind:value={newReward.type} required>
            <option value="">Select Reward Type</option>
            {#each rewardTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>
        <input bind:value={newReward.name} placeholder="Name" required>
        <textarea bind:value={newReward.description} placeholder="Description" required></textarea>
        <input bind:value={newReward.rarity} placeholder="Rarity" required>
        
        {#if showPackFields}
            <input bind:value={newReward.packType} placeholder="Pack Type" required>
        {/if}
        
        {#if showCoinFields || showXPFields}
            <input type="number" bind:value={newReward.amount} placeholder="Amount" required>
        {/if}
        
        {#if showTrophyFields}
            <input bind:value={newReward.trophyType} placeholder="Trophy Type" required>
        {/if}
        
        <button type="submit">Create Reward</button>
    </form>
    
    <h2>Manage Objectives</h2>

    <h2>Create New Objective</h2>
    <form on:submit|preventDefault={createObjective}>
        <input bind:value={newObjective.name} placeholder="Objective Name" required>
        <textarea bind:value={newObjective.description} placeholder="Description" required></textarea>
        <input type="number" bind:value={newObjective.groupId} placeholder="Group ID">
        <input type="number" bind:value={newObjective.rewardId} placeholder="Reward ID">
        <button type="submit">Create Objective</button>
    </form>
    
    <h2>Existing Objectives</h2>
    <ul>
        {#each objectives as objective}
            <li>{objective.name} - {objective.description}</li>
        {/each}
    </ul>
{:else}
    <p>You do not have permission to view this page.</p>
{/if}

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 300px;
        margin-bottom: 2rem;
    }
    input, textarea {
        padding: 5px;
    }
    button {
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #45a049;
    }
</style>