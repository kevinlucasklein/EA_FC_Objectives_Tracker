<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '../stores/auth';
    import { navigate } from 'svelte-routing';
    
    interface Objective {
        id?: number;
        name: string;
        description: string;
        groupId: number | null;
        rewardId: number | null;
    }

    let objectives: Objective[] = [];
    let newObjective: Objective = { name: '', description: '', groupId: null, rewardId: null };
    let isAdmin = false;
    let isLoading = true;
    
    onMount(() => {
        const unsubscribe = auth.subscribe(user => {
            isAdmin = user?.isAdmin || false;
            isLoading = false;
            if (!isLoading && isAdmin) {
                fetchObjectives();
            } else if (!isLoading && !isAdmin) {
                navigate('/');
            }
        });

        return unsubscribe;
    });
    
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
</script>

{#if isLoading}
    <p>Loading...</p>
{:else if isAdmin}
    <h1>Admin Panel</h1>
    
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