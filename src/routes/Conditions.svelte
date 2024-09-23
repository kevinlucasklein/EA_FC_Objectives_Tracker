<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Condition = {
      conditionid: number;
      requirementid: number;
      type: string;
      value: string;
    };
  
    type Requirement = {
      requirementid: number;
      objectiveid: number;
      type: string;
      value: number;
    };
  
    let conditions: Condition[] = [];
    let requirements: Requirement[] = [];
    let isLoading = true;
    let newCondition: Omit<Condition, 'conditionid'> = {
      requirementid: 0,
      type: '',
      value: ''
    };
  
    onMount(async () => {
      console.log('Conditions component mounted');
      await Promise.all([fetchConditions(), fetchRequirements()]);
      isLoading = false;
    });
  
    async function fetchConditions() {
      try {
        const response = await apiRequest('/api/conditions');
        if (response.ok) {
          conditions = await response.json();
        } else {
          console.error('Failed to fetch conditions');
        }
      } catch (error) {
        console.error('Error fetching conditions:', error);
      }
    }
  
    async function fetchRequirements() {
      try {
        const response = await apiRequest('/api/requirements');
        if (response.ok) {
          requirements = await response.json();
        } else {
          console.error('Failed to fetch requirements');
        }
      } catch (error) {
        console.error('Error fetching requirements:', error);
      }
    }
  
    async function addCondition() {
      try {
        const response = await apiRequest('/api/conditions', {
          method: 'POST',
          body: JSON.stringify(newCondition)
        });
        if (response.ok) {
          const addedCondition = await response.json();
          conditions = [...conditions, addedCondition];
          newCondition = { requirementid: 0, type: '', value: '' };
        } else {
          console.error('Failed to add condition');
        }
      } catch (error) {
        console.error('Error adding condition:', error);
      }
    }
  
    async function updateCondition(condition: Condition) {
      try {
        const response = await apiRequest('/api/conditions', {
          method: 'PUT',
          body: JSON.stringify(condition)
        });
        if (response.ok) {
          const updatedCondition = await response.json();
          conditions = conditions.map(c => c.conditionid === updatedCondition.conditionid ? updatedCondition : c);
        } else {
          console.error('Failed to update condition');
        }
      } catch (error) {
        console.error('Error updating condition:', error);
      }
    }
  
    async function deleteCondition(conditionID: number) {
      try {
        const response = await apiRequest(`/api/conditions/${conditionID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          conditions = conditions.filter(c => c.conditionid !== conditionID);
        } else {
          console.error('Failed to delete condition');
        }
      } catch (error) {
        console.error('Error deleting condition:', error);
      }
    }
  
    function getRequirementDescription(requirementId: number): string {
      const requirement = requirements.find(r => r.requirementid === requirementId);
      return requirement ? `${requirement.type} (${requirement.value})` : 'Unknown Requirement';
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Conditions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Requirement</th>
            <th>Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each conditions as condition}
            <tr>
              <td>{condition.conditionid}</td>
              <td>
                <select bind:value={condition.requirementid} on:change={() => updateCondition(condition)}>
                  {#each requirements as requirement}
                    <option value={requirement.requirementid}>{getRequirementDescription(requirement.requirementid)}</option>
                  {/each}
                </select>
              </td>
              <td contenteditable on:blur={() => updateCondition(condition)}>{condition.type}</td>
              <td contenteditable on:blur={() => updateCondition(condition)}>{condition.value}</td>
              <td>
                <button on:click={() => deleteCondition(condition.conditionid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Condition</h3>
      <form on:submit|preventDefault={addCondition}>
        <label>
          Requirement:
          <select bind:value={newCondition.requirementid} required>
            <option value="">Select a Requirement</option>
            {#each requirements as requirement}
              <option value={requirement.requirementid}>{getRequirementDescription(requirement.requirementid)}</option>
            {/each}
          </select>
        </label>
        <label>
          Type:
          <input type="text" bind:value={newCondition.type} required />
        </label>
        <label>
          Value:
          <input type="text" bind:value={newCondition.value} required />
        </label>
        <button type="submit">Add Condition</button>
      </form>
    </div>
  {/if}