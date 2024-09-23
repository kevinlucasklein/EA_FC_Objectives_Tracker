<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type PlayerAttribute = {
      attributeid: number;
      name: string;
    };
  
    let playerAttributes: PlayerAttribute[] = [];
    let isLoading = true;
    let newAttribute: Omit<PlayerAttribute, 'attributeid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('PlayerAttributes component mounted');
      await fetchPlayerAttributes();
      isLoading = false;
    });
  
    async function fetchPlayerAttributes() {
      try {
        const response = await apiRequest('/api/playerattributes');
        if (response.ok) {
          playerAttributes = await response.json();
        } else {
          console.error('Failed to fetch player attributes');
        }
      } catch (error) {
        console.error('Error fetching player attributes:', error);
      }
    }
  
    async function addPlayerAttribute() {
      try {
        const response = await apiRequest('/api/playerattributes', {
          method: 'POST',
          body: JSON.stringify(newAttribute)
        });
        if (response.ok) {
          const addedAttribute = await response.json();
          playerAttributes = [...playerAttributes, addedAttribute].sort((a, b) => a.name.localeCompare(b.name));
          newAttribute.name = '';
        } else {
          console.error('Failed to add player attribute');
        }
      } catch (error) {
        console.error('Error adding player attribute:', error);
      }
    }
  
    async function updatePlayerAttribute(attribute: PlayerAttribute) {
      try {
        const response = await apiRequest('/api/playerattributes', {
          method: 'PUT',
          body: JSON.stringify(attribute)
        });
        if (response.ok) {
          const updatedAttribute = await response.json();
          playerAttributes = playerAttributes.map(a => a.attributeid === updatedAttribute.attributeid ? updatedAttribute : a)
                                             .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update player attribute');
        }
      } catch (error) {
        console.error('Error updating player attribute:', error);
      }
    }
  
    async function deletePlayerAttribute(attributeID: number) {
      try {
        const response = await apiRequest(`/api/playerattributes/${attributeID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          playerAttributes = playerAttributes.filter(a => a.attributeid !== attributeID);
        } else {
          console.error('Failed to delete player attribute');
        }
      } catch (error) {
        console.error('Error deleting player attribute:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Player Attributes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each playerAttributes as attribute}
            <tr>
              <td>{attribute.attributeid}</td>
              <td contenteditable on:blur={() => updatePlayerAttribute(attribute)}>{attribute.name}</td>
              <td>
                <button on:click={() => deletePlayerAttribute(attribute.attributeid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Player Attribute</h3>
      <form on:submit|preventDefault={addPlayerAttribute}>
        <label>
          Name:
          <input type="text" bind:value={newAttribute.name} required />
        </label>
        <button type="submit">Add Player Attribute</button>
      </form>
    </div>
  {/if}