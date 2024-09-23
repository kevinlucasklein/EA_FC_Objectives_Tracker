<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type ObjectiveGroup = {
      groupid: number;
      typeid: number | null;
      name: string;
      starttime: string | null;
      expirationtime: string | null;
    };
  
    type ObjectiveType = {
      typeid: number;
      name: string;
    };
  
    let objectiveGroups: ObjectiveGroup[] = [];
    let objectiveTypes: ObjectiveType[] = [];
    let isLoading = true;
    let newObjectiveGroup: Omit<ObjectiveGroup, 'groupid'> = { 
      typeid: null, 
      name: '', 
      starttime: null, 
      expirationtime: null 
    };
  
    onMount(async () => {
      console.log('ObjectiveGroups component mounted');
      await Promise.all([fetchObjectiveGroups(), fetchObjectiveTypes()]);
      isLoading = false;
    });
  
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
  
    async function fetchObjectiveTypes() {
      try {
        const response = await apiRequest('/api/objectivetypes');
        if (response.ok) {
          objectiveTypes = await response.json();
          if (objectiveTypes.length > 0) {
            newObjectiveGroup.typeid = objectiveTypes[0].typeid;
          }
        } else {
          console.error('Failed to fetch objective types');
        }
      } catch (error) {
        console.error('Error fetching objective types:', error);
      }
    }
  
    async function addObjectiveGroup() {
      if (newObjectiveGroup.typeid === null) {
        alert("Please select an objective type");
        return;
      }
      try {
        const response = await apiRequest('/api/objectivegroups', {
          method: 'POST',
          body: JSON.stringify(newObjectiveGroup)
        });
        if (response.ok) {
          const addedGroup = await response.json();
          objectiveGroups = [...objectiveGroups, addedGroup];
          newObjectiveGroup = { typeid: null, name: '', starttime: null, expirationtime: null };
        } else {
          console.error('Failed to add objective group');
        }
      } catch (error) {
        console.error('Error adding objective group:', error);
      }
    }
  
    async function updateObjectiveGroup(group: ObjectiveGroup) {
      try {
        const response = await apiRequest('/api/objectivegroups', {
          method: 'PUT',
          body: JSON.stringify(group)
        });
        if (response.ok) {
          const updatedGroup = await response.json();
          objectiveGroups = objectiveGroups.map(g => g.groupid === updatedGroup.groupid ? updatedGroup : g);
        } else {
          console.error('Failed to update objective group');
        }
      } catch (error) {
        console.error('Error updating objective group:', error);
      }
    }
  
    async function deleteObjectiveGroup(groupID: number) {
      try {
        const response = await apiRequest(`/api/objectivegroups/${groupID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          objectiveGroups = objectiveGroups.filter(g => g.groupid !== groupID);
        } else {
          console.error('Failed to delete objective group');
        }
      } catch (error) {
        console.error('Error deleting objective group:', error);
      }
    }
  
    function getObjectiveTypeName(typeId: number | null): string {
      return objectiveTypes.find(type => type.typeid === typeId)?.name || 'Unknown';
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Objective Groups</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Name</th>
            <th>Start Time</th>
            <th>Expiration Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each objectiveGroups as group}
            <tr>
              <td>{group.groupid}</td>
              <td>
                <select bind:value={group.typeid} on:change={() => updateObjectiveGroup(group)}>
                  <option value={null}>Select a type</option>
                  {#each objectiveTypes as type}
                    <option value={type.typeid}>{type.name}</option>
                  {/each}
                </select>
              </td>
              <td contenteditable on:blur={() => updateObjectiveGroup(group)}>{group.name}</td>
              <td><input type="datetime-local" bind:value={group.starttime} on:change={() => updateObjectiveGroup(group)} /></td>
              <td><input type="datetime-local" bind:value={group.expirationtime} on:change={() => updateObjectiveGroup(group)} /></td>
              <td>
                <button on:click={() => deleteObjectiveGroup(group.groupid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Objective Group</h3>
      <form on:submit|preventDefault={addObjectiveGroup}>
        <label>
          Type:
          <select bind:value={newObjectiveGroup.typeid} required>
            <option value={null} disabled>Select a type</option>
            {#if objectiveTypes.length === 0}
              <option value={null} disabled>No active objective types</option>
            {:else}
              {#each objectiveTypes as type}
                <option value={type.typeid}>{type.name}</option>
              {/each}
            {/if}
          </select>
        </label>
        <label>
          Name:
          <input type="text" bind:value={newObjectiveGroup.name} required />
        </label>
        <label>
          Start Time:
          <input type="datetime-local" bind:value={newObjectiveGroup.starttime} />
        </label>
        <label>
          Expiration Time:
          <input type="datetime-local" bind:value={newObjectiveGroup.expirationtime} />
        </label>
        <button type="submit">Add Objective Group</button>
      </form>
    </div>
  {/if}