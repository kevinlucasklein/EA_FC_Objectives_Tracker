<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Requirement = {
      requirementid: number;
      objectiveid: number;
      type: string;
      value: number;
    };
  
    type Objective = {
      objectiveid: number;
      name: string;
    };
  
    let requirements: Requirement[] = [];
    let objectives: Objective[] = [];
    let isLoading = true;
    let newRequirement: Omit<Requirement, 'requirementid'> = {
      objectiveid: 0,
      type: '',
      value: 0
    };
  
    onMount(async () => {
      console.log('Requirements component mounted');
      await Promise.all([fetchRequirements(), fetchObjectives()]);
      isLoading = false;
    });
  
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
  
    async function addRequirement() {
      try {
        const response = await apiRequest('/api/requirements', {
          method: 'POST',
          body: JSON.stringify(newRequirement)
        });
        if (response.ok) {
          const addedRequirement = await response.json();
          requirements = [...requirements, addedRequirement];
          newRequirement = { objectiveid: 0, type: '', value: 0 };
        } else {
          console.error('Failed to add requirement');
        }
      } catch (error) {
        console.error('Error adding requirement:', error);
      }
    }
  
    async function updateRequirement(requirement: Requirement) {
      try {
        const response = await apiRequest('/api/requirements', {
          method: 'PUT',
          body: JSON.stringify(requirement)
        });
        if (response.ok) {
          const updatedRequirement = await response.json();
          requirements = requirements.map(r => r.requirementid === updatedRequirement.requirementid ? updatedRequirement : r);
        } else {
          console.error('Failed to update requirement');
        }
      } catch (error) {
        console.error('Error updating requirement:', error);
      }
    }
  
    async function deleteRequirement(requirementID: number) {
      try {
        const response = await apiRequest(`/api/requirements/${requirementID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          requirements = requirements.filter(r => r.requirementid !== requirementID);
        } else {
          console.error('Failed to delete requirement');
        }
      } catch (error) {
        console.error('Error deleting requirement:', error);
      }
    }
  
    function getObjectiveName(objectiveId: number): string {
      return objectives.find(objective => objective.objectiveid === objectiveId)?.name || 'Unknown Objective';
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Requirements</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Objective</th>
            <th>Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each requirements as requirement}
            <tr>
              <td>{requirement.requirementid}</td>
              <td>
                <select bind:value={requirement.objectiveid} on:change={() => updateRequirement(requirement)}>
                  {#each objectives as objective}
                    <option value={objective.objectiveid}>{objective.name}</option>
                  {/each}
                </select>
              </td>
              <td contenteditable on:blur={() => updateRequirement(requirement)}>{requirement.type}</td>
              <td contenteditable on:blur={() => updateRequirement(requirement)}>{requirement.value}</td>
              <td>
                <button on:click={() => deleteRequirement(requirement.requirementid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Requirement</h3>
      <form on:submit|preventDefault={addRequirement}>
        <label>
          Objective:
          <select bind:value={newRequirement.objectiveid} required>
            <option value="">Select an Objective</option>
            {#each objectives as objective}
              <option value={objective.objectiveid}>{objective.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Type:
          <input type="text" bind:value={newRequirement.type} required />
        </label>
        <label>
          Value:
          <input type="number" bind:value={newRequirement.value} required />
        </label>
        <button type="submit">Add Requirement</button>
      </form>
    </div>
  {/if}