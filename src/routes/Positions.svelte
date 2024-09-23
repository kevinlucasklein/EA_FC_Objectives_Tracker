<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Position = {
      positionid: number;
      name: string;
    };
  
    let positions: Position[] = [];
    let isLoading = true;
    let newPosition: Omit<Position, 'positionid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('Positions component mounted');
      await fetchPositions();
      isLoading = false;
    });
  
    async function fetchPositions() {
      try {
        const response = await apiRequest('/api/positions');
        if (response.ok) {
          positions = await response.json();
        } else {
          console.error('Failed to fetch positions');
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    }
  
    async function addPosition() {
      try {
        const response = await apiRequest('/api/positions', {
          method: 'POST',
          body: JSON.stringify(newPosition)
        });
        if (response.ok) {
          const addedPosition = await response.json();
          positions = [...positions, addedPosition].sort((a, b) => a.name.localeCompare(b.name));
          newPosition.name = '';
        } else {
          console.error('Failed to add position');
        }
      } catch (error) {
        console.error('Error adding position:', error);
      }
    }
  
    async function updatePosition(position: Position) {
      try {
        const response = await apiRequest('/api/positions', {
          method: 'PUT',
          body: JSON.stringify(position)
        });
        if (response.ok) {
          const updatedPosition = await response.json();
          positions = positions.map(p => p.positionid === updatedPosition.positionid ? updatedPosition : p)
                               .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update position');
        }
      } catch (error) {
        console.error('Error updating position:', error);
      }
    }
  
    async function deletePosition(positionID: number) {
      try {
        const response = await apiRequest(`/api/positions/${positionID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          positions = positions.filter(p => p.positionid !== positionID);
        } else {
          console.error('Failed to delete position');
        }
      } catch (error) {
        console.error('Error deleting position:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Positions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each positions as position}
            <tr>
              <td>{position.positionid}</td>
              <td contenteditable on:blur={() => updatePosition(position)}>{position.name}</td>
              <td>
                <button on:click={() => deletePosition(position.positionid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Position</h3>
      <form on:submit|preventDefault={addPosition}>
        <label>
          Name:
          <input type="text" bind:value={newPosition.name} required />
        </label>
        <button type="submit">Add Position</button>
      </form>
    </div>
  {/if}