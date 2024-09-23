<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Foot = {
      footid: number;
      name: string;
    };
  
    let feet: Foot[] = [];
    let isLoading = true;
    let newFoot: Omit<Foot, 'footid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('Feet component mounted');
      await fetchFeet();
      isLoading = false;
    });
  
    async function fetchFeet() {
      try {
        const response = await apiRequest('/api/feet');
        if (response.ok) {
          feet = await response.json();
        } else {
          console.error('Failed to fetch feet');
        }
      } catch (error) {
        console.error('Error fetching feet:', error);
      }
    }
  
    async function addFoot() {
      try {
        const response = await apiRequest('/api/feet', {
          method: 'POST',
          body: JSON.stringify(newFoot)
        });
        if (response.ok) {
          const addedFoot = await response.json();
          feet = [...feet, addedFoot].sort((a, b) => a.name.localeCompare(b.name));
          newFoot.name = '';
        } else {
          console.error('Failed to add foot');
        }
      } catch (error) {
        console.error('Error adding foot:', error);
      }
    }
  
    async function updateFoot(foot: Foot) {
      try {
        const response = await apiRequest('/api/feet', {
          method: 'PUT',
          body: JSON.stringify(foot)
        });
        if (response.ok) {
          const updatedFoot = await response.json();
          feet = feet.map(f => f.footid === updatedFoot.footid ? updatedFoot : f)
                     .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update foot');
        }
      } catch (error) {
        console.error('Error updating foot:', error);
      }
    }
  
    async function deleteFoot(footID: number) {
      try {
        const response = await apiRequest(`/api/feet/${footID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          feet = feet.filter(f => f.footid !== footID);
        } else {
          console.error('Failed to delete foot');
        }
      } catch (error) {
        console.error('Error deleting foot:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Feet</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each feet as foot}
            <tr>
              <td>{foot.footid}</td>
              <td contenteditable on:blur={() => updateFoot(foot)}>{foot.name}</td>
              <td>
                <button on:click={() => deleteFoot(foot.footid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Foot</h3>
      <form on:submit|preventDefault={addFoot}>
        <label>
          Name:
          <input type="text" bind:value={newFoot.name} required />
        </label>
        <button type="submit">Add Foot</button>
      </form>
    </div>
  {/if}