<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type ObjectiveType = {
      typeid: number;
      name: string;
    };
  
    let objectiveTypes: ObjectiveType[] = [];
    let isLoading = true;
    let newObjectiveType: Omit<ObjectiveType, 'typeid'> = { name: '' };
  
    onMount(async () => {
      console.log('ObjectiveTypes component mounted');
      await fetchObjectiveTypes();
    });
  
    async function fetchObjectiveTypes() {
      try {
        const response = await apiRequest('/api/objectivetypes');
        if (response.ok) {
          objectiveTypes = await response.json();
        } else {
          console.error('Failed to fetch objective types');
        }
      } catch (error) {
        console.error('Error fetching objective types:', error);
      } finally {
        isLoading = false;
      }
    }
  
    async function addObjectiveType() {
      try {
        const response = await apiRequest('/api/objectivetypes', {
          method: 'POST',
          body: JSON.stringify(newObjectiveType)
        });
        if (response.ok) {
          const addedType = await response.json();
          objectiveTypes = [...objectiveTypes, addedType];
          newObjectiveType = { name: '' };
        } else {
          console.error('Failed to add objective type');
        }
      } catch (error) {
        console.error('Error adding objective type:', error);
      }
    }
  
    async function updateObjectiveType(type: ObjectiveType) {
      try {
        const response = await apiRequest('/api/objectivetypes', {
          method: 'PUT',
          body: JSON.stringify(type)
        });
        if (response.ok) {
          const updatedType = await response.json();
          objectiveTypes = objectiveTypes.map(t => t.typeid === updatedType.typeid ? updatedType : t);
        } else {
          console.error('Failed to update objective type');
        }
      } catch (error) {
        console.error('Error updating objective type:', error);
      }
    }
  
    async function deleteObjectiveType(typeID: number) {
      try {
        const response = await apiRequest(`/api/objectivetypes/${typeID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          objectiveTypes = objectiveTypes.filter(t => t.typeid !== typeID);
        } else {
          console.error('Failed to delete objective type');
        }
      } catch (error) {
        console.error('Error deleting objective type:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Objective Types</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each objectiveTypes as type}
            <tr>
              <td>{type.typeid}</td>
              <td contenteditable on:blur={() => updateObjectiveType(type)}>{type.name}</td>
              <td>
                <button on:click={() => deleteObjectiveType(type.typeid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Objective Type</h3>
      <form on:submit|preventDefault={addObjectiveType}>
        <label>
          Name:
          <input type="text" bind:value={newObjectiveType.name} />
        </label>
        <button type="submit">Add Objective Type</button>
      </form>
    </div>
  {/if}