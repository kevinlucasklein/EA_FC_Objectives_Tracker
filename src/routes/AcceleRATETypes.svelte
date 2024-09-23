<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type AcceleRATEType = {
      accelerateid: number;
      name: string;
    };
  
    let acceleRATETypes: AcceleRATEType[] = [];
    let isLoading = true;
    let newAcceleRATEType: Omit<AcceleRATEType, 'accelerateid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('AcceleRATETypes component mounted');
      await fetchAcceleRATETypes();
      isLoading = false;
    });
  
    async function fetchAcceleRATETypes() {
      try {
        const response = await apiRequest('/api/acceleratetypes');
        if (response.ok) {
          acceleRATETypes = await response.json();
        } else {
          console.error('Failed to fetch AcceleRATE types');
        }
      } catch (error) {
        console.error('Error fetching AcceleRATE types:', error);
      }
    }
  
    async function addAcceleRATEType() {
      try {
        const response = await apiRequest('/api/acceleratetypes', {
          method: 'POST',
          body: JSON.stringify(newAcceleRATEType)
        });
        if (response.ok) {
          const addedAcceleRATEType = await response.json();
          acceleRATETypes = [...acceleRATETypes, addedAcceleRATEType].sort((a, b) => a.name.localeCompare(b.name));
          newAcceleRATEType.name = '';
        } else {
          console.error('Failed to add AcceleRATE type');
        }
      } catch (error) {
        console.error('Error adding AcceleRATE type:', error);
      }
    }
  
    async function updateAcceleRATEType(acceleRATEType: AcceleRATEType) {
      try {
        const response = await apiRequest('/api/acceleratetypes', {
          method: 'PUT',
          body: JSON.stringify(acceleRATEType)
        });
        if (response.ok) {
          const updatedAcceleRATEType = await response.json();
          acceleRATETypes = acceleRATETypes.map(art => art.accelerateid === updatedAcceleRATEType.accelerateid ? updatedAcceleRATEType : art)
                                           .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update AcceleRATE type');
        }
      } catch (error) {
        console.error('Error updating AcceleRATE type:', error);
      }
    }
  
    async function deleteAcceleRATEType(acceleRATEID: number) {
      try {
        const response = await apiRequest(`/api/acceleratetypes/${acceleRATEID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          acceleRATETypes = acceleRATETypes.filter(art => art.accelerateid !== acceleRATEID);
        } else {
          console.error('Failed to delete AcceleRATE type');
        }
      } catch (error) {
        console.error('Error deleting AcceleRATE type:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>AcceleRATE Types</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each acceleRATETypes as acceleRATEType}
            <tr>
              <td>{acceleRATEType.accelerateid}</td>
              <td contenteditable on:blur={() => updateAcceleRATEType(acceleRATEType)}>{acceleRATEType.name}</td>
              <td>
                <button on:click={() => deleteAcceleRATEType(acceleRATEType.accelerateid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New AcceleRATE Type</h3>
      <form on:submit|preventDefault={addAcceleRATEType}>
        <label>
          Name:
          <input type="text" bind:value={newAcceleRATEType.name} required />
        </label>
        <button type="submit">Add AcceleRATE Type</button>
      </form>
    </div>
  {/if}