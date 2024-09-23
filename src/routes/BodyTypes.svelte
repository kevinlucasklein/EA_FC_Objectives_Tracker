<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type BodyType = {
      bodytypeid: number;
      name: string;
    };
  
    let bodyTypes: BodyType[] = [];
    let isLoading = true;
    let newBodyType: Omit<BodyType, 'bodytypeid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('BodyTypes component mounted');
      await fetchBodyTypes();
      isLoading = false;
    });
  
    async function fetchBodyTypes() {
      try {
        const response = await apiRequest('/api/bodytypes');
        if (response.ok) {
          bodyTypes = await response.json();
        } else {
          console.error('Failed to fetch body types');
        }
      } catch (error) {
        console.error('Error fetching body types:', error);
      }
    }
  
    async function addBodyType() {
      try {
        const response = await apiRequest('/api/bodytypes', {
          method: 'POST',
          body: JSON.stringify(newBodyType)
        });
        if (response.ok) {
          const addedBodyType = await response.json();
          bodyTypes = [...bodyTypes, addedBodyType].sort((a, b) => a.name.localeCompare(b.name));
          newBodyType.name = '';
        } else {
          console.error('Failed to add body type');
        }
      } catch (error) {
        console.error('Error adding body type:', error);
      }
    }
  
    async function updateBodyType(bodyType: BodyType) {
      try {
        const response = await apiRequest('/api/bodytypes', {
          method: 'PUT',
          body: JSON.stringify(bodyType)
        });
        if (response.ok) {
          const updatedBodyType = await response.json();
          bodyTypes = bodyTypes.map(bt => bt.bodytypeid === updatedBodyType.bodytypeid ? updatedBodyType : bt)
                               .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update body type');
        }
      } catch (error) {
        console.error('Error updating body type:', error);
      }
    }
  
    async function deleteBodyType(bodyTypeID: number) {
      try {
        const response = await apiRequest(`/api/bodytypes/${bodyTypeID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          bodyTypes = bodyTypes.filter(bt => bt.bodytypeid !== bodyTypeID);
        } else {
          console.error('Failed to delete body type');
        }
      } catch (error) {
        console.error('Error deleting body type:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Body Types</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each bodyTypes as bodyType}
            <tr>
              <td>{bodyType.bodytypeid}</td>
              <td contenteditable on:blur={() => updateBodyType(bodyType)}>{bodyType.name}</td>
              <td>
                <button on:click={() => deleteBodyType(bodyType.bodytypeid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Body Type</h3>
      <form on:submit|preventDefault={addBodyType}>
        <label>
          Name:
          <input type="text" bind:value={newBodyType.name} required />
        </label>
        <button type="submit">Add Body Type</button>
      </form>
    </div>
  {/if}