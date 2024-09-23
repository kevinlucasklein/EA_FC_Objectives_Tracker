<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type PlayerAttributeRating = {
      ratingid: number;
      playerid: number;
      attributeid: number;
      value: number;
      playername: string;
      attributename: string;
    };
  
    type Player = {
      playerid: number;
      name: string;
    };
  
    type PlayerAttribute = {
      attributeid: number;
      name: string;
    };
  
    let playerAttributeRatings: PlayerAttributeRating[] = [];
    let players: Player[] = [];
    let playerAttributes: PlayerAttribute[] = [];
    let isLoading = true;
    let newRating: Omit<PlayerAttributeRating, 'ratingid' | 'playername' | 'attributename'> = {
      playerid: 0,
      attributeid: 0,
      value: 0
    };
  
    onMount(async () => {
      console.log('PlayerAttributeRatings component mounted');
      await Promise.all([fetchPlayerAttributeRatings(), fetchPlayers(), fetchPlayerAttributes()]);
      isLoading = false;
    });
  
    async function fetchPlayerAttributeRatings() {
      try {
        const response = await apiRequest('/api/playerattributeratings');
        if (response.ok) {
          playerAttributeRatings = await response.json();
        } else {
          console.error('Failed to fetch player attribute ratings');
        }
      } catch (error) {
        console.error('Error fetching player attribute ratings:', error);
      }
    }
  
    async function fetchPlayers() {
      try {
        const response = await apiRequest('/api/players');
        if (response.ok) {
          players = await response.json();
        } else {
          console.error('Failed to fetch players');
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }
  
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
  
    async function addPlayerAttributeRating() {
      try {
        const response = await apiRequest('/api/playerattributeratings', {
          method: 'POST',
          body: JSON.stringify(newRating)
        });
        if (response.ok) {
          const addedRating = await response.json();
          playerAttributeRatings = [...playerAttributeRatings, addedRating].sort((a, b) => a.playername.localeCompare(b.playername) || a.attributename.localeCompare(b.attributename));
          newRating = { playerid: 0, attributeid: 0, value: 0 };
        } else {
          console.error('Failed to add player attribute rating');
        }
      } catch (error) {
        console.error('Error adding player attribute rating:', error);
      }
    }
  
    async function updatePlayerAttributeRating(rating: PlayerAttributeRating) {
      try {
        const response = await apiRequest('/api/playerattributeratings', {
          method: 'PUT',
          body: JSON.stringify(rating)
        });
        if (response.ok) {
          const updatedRating = await response.json();
          playerAttributeRatings = playerAttributeRatings.map(r => r.ratingid === updatedRating.ratingid ? updatedRating : r)
                                                         .sort((a, b) => a.playername.localeCompare(b.playername) || a.attributename.localeCompare(b.attributename));
        } else {
          console.error('Failed to update player attribute rating');
        }
      } catch (error) {
        console.error('Error updating player attribute rating:', error);
      }
    }
  
    async function deletePlayerAttributeRating(ratingID: number) {
      try {
        const response = await apiRequest(`/api/playerattributeratings/${ratingID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          playerAttributeRatings = playerAttributeRatings.filter(r => r.ratingid !== ratingID);
        } else {
          console.error('Failed to delete player attribute rating');
        }
      } catch (error) {
        console.error('Error deleting player attribute rating:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Player Attribute Ratings</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Player</th>
            <th>Attribute</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each playerAttributeRatings as rating}
            <tr>
              <td>{rating.ratingid}</td>
              <td>
                <select bind:value={rating.playerid} on:change={() => updatePlayerAttributeRating(rating)}>
                  {#each players as player}
                    <option value={player.playerid}>{player.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={rating.attributeid} on:change={() => updatePlayerAttributeRating(rating)}>
                  {#each playerAttributes as attribute}
                    <option value={attribute.attributeid}>{attribute.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="number" bind:value={rating.value} on:change={() => updatePlayerAttributeRating(rating)} min="0" max="100" />
              </td>
              <td>
                <button on:click={() => deletePlayerAttributeRating(rating.ratingid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Player Attribute Rating</h3>
      <form on:submit|preventDefault={addPlayerAttributeRating}>
        <label>
          Player:
          <select bind:value={newRating.playerid} required>
            <option value="">Select a Player</option>
            {#each players as player}
              <option value={player.playerid}>{player.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Attribute:
          <select bind:value={newRating.attributeid} required>
            <option value="">Select an Attribute</option>
            {#each playerAttributes as attribute}
              <option value={attribute.attributeid}>{attribute.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Value:
          <input type="number" bind:value={newRating.value} required min="0" max="100" />
        </label>
        <button type="submit">Add Player Attribute Rating</button>
      </form>
    </div>
  {/if}