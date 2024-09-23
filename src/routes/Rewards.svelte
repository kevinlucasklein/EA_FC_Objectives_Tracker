<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    // Define the Reward type
    type Reward = {
      rewardid: number;
      type: string;
      value: number;
      description: string;
      rarity: string;
    };
  
    let rewards: Reward[] = [];
    let isLoading = true;
    let newReward: Omit<Reward, 'rewardid'> = { type: '', value: 0, description: '', rarity: '' };
  
    onMount(async () => {
      console.log('Rewards component mounted');
      await fetchRewards();
    });
  
    async function fetchRewards() {
      try {
        const response = await apiRequest('/api/rewards');
        if (response.ok) {
          rewards = await response.json();
        } else {
          console.error('Failed to fetch rewards');
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
      } finally {
        isLoading = false;
      }
    }
  
    async function addReward() {
      try {
        const response = await apiRequest('/api/rewards', {
          method: 'POST',
          body: JSON.stringify(newReward)
        });
        if (response.ok) {
          const addedReward = await response.json();
          rewards = [...rewards, addedReward];
          newReward = { type: '', value: 0, description: '', rarity: '' };
        } else {
          console.error('Failed to add reward');
        }
      } catch (error) {
        console.error('Error adding reward:', error);
      }
    }
  
    async function updateReward(reward: Reward) {
      try {
        const response = await apiRequest('/api/rewards', {
          method: 'PUT',
          body: JSON.stringify(reward)
        });
        if (response.ok) {
          const updatedReward = await response.json();
          rewards = rewards.map(r => r.rewardid === updatedReward.rewardid ? updatedReward : r);
        } else {
          console.error('Failed to update reward');
        }
      } catch (error) {
        console.error('Error updating reward:', error);
      }
    }
  
    async function deleteReward(rewardID: number) {
      try {
        const response = await apiRequest(`/api/rewards/${rewardID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          rewards = rewards.filter(r => r.rewardid !== rewardID);
        } else {
          console.error('Failed to delete reward');
        }
      } catch (error) {
        console.error('Error deleting reward:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Rewards</h2>
      <p>Rewards component is rendered</p> <!-- Add a simple message for debugging -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Value</th>
            <th>Description</th>
            <th>Rarity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each rewards as reward}
            <tr>
              <td>{reward.rewardid}</td>
              <td contenteditable on:blur={() => updateReward(reward)}>{reward.type}</td>
              <td contenteditable on:blur={() => updateReward(reward)}>{reward.value}</td>
              <td contenteditable on:blur={() => updateReward(reward)}>{reward.description}</td>
              <td contenteditable on:blur={() => updateReward(reward)}>{reward.rarity}</td>
              <td>
                <button on:click={() => deleteReward(reward.rewardid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Reward</h3>
      <form on:submit|preventDefault={addReward}>
        <label>
          Type:
          <input type="text" bind:value={newReward.type} />
        </label>
        <label>
          Value:
          <input type="number" bind:value={newReward.value} />
        </label>
        <label>
          Description:
          <input type="text" bind:value={newReward.description} />
        </label>
        <label>
          Rarity:
          <input type="text" bind:value={newReward.rarity} />
        </label>
        <button type="submit">Add Reward</button>
      </form>
    </div>
  {/if}