<script lang="ts">
  import { onMount } from 'svelte';
  import { apiRequest } from '../utils/api';

  type Objective = {
    objectiveid: number;
    groupid: number | null;
    name: string;
    description: string;
    rewardid: number | null;
  };

  type ObjectiveGroup = {
    groupid: number;
    name: string;
  };

  type Reward = {
    rewardid: number;
    name: string;
  };

  let objectives: Objective[] = [];
  let objectiveGroups: ObjectiveGroup[] = [];
  let rewards: Reward[] = [];
  let isLoading = true;
  let newObjective: Omit<Objective, 'objectiveid'> = {
    groupid: null,
    name: '',
    description: '',
    rewardid: null
  };

  onMount(async () => {
    console.log('Objectives component mounted');
    await Promise.all([fetchObjectives(), fetchObjectiveGroups(), fetchRewards()]);
    isLoading = false;
  });

  async function fetchObjectives() {
    try {
      const response = await apiRequest('/api/objectives');
      if (response.ok) {
        objectives = await response.json();
      } else {
        console.error('Failed to fetch objectives');
      }
    } catch (error) {
      console.error('Error fetching objectives:', error);
    }
  }

  async function fetchObjectiveGroups() {
    try {
      const response = await apiRequest('/api/objectivegroups');
      if (response.ok) {
        objectiveGroups = await response.json();
      } else {
        console.error('Failed to fetch objective groups');
      }
    } catch (error) {
      console.error('Error fetching objective groups:', error);
    }
  }

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
    }
  }

  async function addObjective() {
    try {
      const response = await apiRequest('/api/objectives', {
        method: 'POST',
        body: JSON.stringify(newObjective)
      });
      if (response.ok) {
        const addedObjective = await response.json();
        objectives = [...objectives, addedObjective];
        newObjective = { groupid: null, name: '', description: '', rewardid: null };
      } else {
        console.error('Failed to add objective');
      }
    } catch (error) {
      console.error('Error adding objective:', error);
    }
  }

  async function updateObjective(objective: Objective) {
    try {
      const response = await apiRequest('/api/objectives', {
        method: 'PUT',
        body: JSON.stringify(objective)
      });
      if (response.ok) {
        const updatedObjective = await response.json();
        objectives = objectives.map(o => o.objectiveid === updatedObjective.objectiveid ? updatedObjective : o);
      } else {
        console.error('Failed to update objective');
      }
    } catch (error) {
      console.error('Error updating objective:', error);
    }
  }

  async function deleteObjective(objectiveID: number) {
    try {
      const response = await apiRequest(`/api/objectives/${objectiveID}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        objectives = objectives.filter(o => o.objectiveid !== objectiveID);
      } else {
        console.error('Failed to delete objective');
      }
    } catch (error) {
      console.error('Error deleting objective:', error);
    }
  }

  function getObjectiveGroupName(groupId: number | null): string {
    return objectiveGroups.find(group => group.groupid === groupId)?.name || 'No Group';
  }

  function getRewardName(rewardId: number | null): string {
    return rewards.find(reward => reward.rewardid === rewardId)?.name || 'No Reward';
  }
</script>

{#if isLoading}
  <p>Loading...</p>
{:else}
  <div>
    <h2>Objectives</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Group</th>
          <th>Name</th>
          <th>Description</th>
          <th>Reward</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each objectives as objective}
          <tr>
            <td>{objective.objectiveid}</td>
            <td>
              <select bind:value={objective.groupid} on:change={() => updateObjective(objective)}>
                <option value={null}>No Group</option>
                {#each objectiveGroups as group}
                  <option value={group.groupid}>{group.name}</option>
                {/each}
              </select>
            </td>
            <td contenteditable on:blur={() => updateObjective(objective)}>{objective.name}</td>
            <td contenteditable on:blur={() => updateObjective(objective)}>{objective.description}</td>
            <td>
              <select bind:value={objective.rewardid} on:change={() => updateObjective(objective)}>
                <option value={null}>No Reward</option>
                {#each rewards as reward}
                  <option value={reward.rewardid}>{reward.name}</option>
                {/each}
              </select>
            </td>
            <td>
              <button on:click={() => deleteObjective(objective.objectiveid)}>Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <h3>Add New Objective</h3>
    <form on:submit|preventDefault={addObjective}>
      <label>
        Group:
        <select bind:value={newObjective.groupid}>
          <option value={null}>No Group</option>
          {#each objectiveGroups as group}
            <option value={group.groupid}>{group.name}</option>
          {/each}
        </select>
      </label>
      <label>
        Name:
        <input type="text" bind:value={newObjective.name} required />
      </label>
      <label>
        Description:
        <textarea bind:value={newObjective.description}></textarea>
      </label>
      <label>
        Reward:
        <select bind:value={newObjective.rewardid}>
          <option value={null}>No Reward</option>
          {#each rewards as reward}
            <option value={reward.rewardid}>{reward.name}</option>
          {/each}
        </select>
      </label>
      <button type="submit">Add Objective</button>
    </form>
  </div>
{/if}