<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Player = {
      playerid: number;
      name: string;
      teamid: number;
      nationid: number;
      leagueid: number;
      positionid: number;
      footid: number;
      skillmoves: number;
      weakfoot: number;
      accelerateid: number;
      height: number;
      weight: number;
      bodytypeid: number;
      age: number;
      rating: number;
      teamname: string;
      nationname: string;
      leaguename: string;
      positionname: string;
      footname: string;
      acceleratename: string;
      bodytypename: string;
    };
  
    type Team = { teamid: number; name: string; };
    type Country = { countryid: number; name: string; };
    type League = { leagueid: number; name: string; };
    type Position = { positionid: number; name: string; };
    type Foot = { footid: number; name: string; };
    type AcceleRATEType = { accelerateid: number; name: string; };
    type BodyType = { bodytypeid: number; name: string; };
  
    let players: Player[] = [];
    let teams: Team[] = [];
    let countries: Country[] = [];
    let leagues: League[] = [];
    let positions: Position[] = [];
    let feet: Foot[] = [];
    let acceleRATETypes: AcceleRATEType[] = [];
    let bodyTypes: BodyType[] = [];
    let isLoading = true;
  
    let newPlayer: Omit<Player, 'playerid' | 'teamname' | 'nationname' | 'leaguename' | 'positionname' | 'footname' | 'acceleratename' | 'bodytypename'> = {
      name: '',
      teamid: 0,
      nationid: 0,
      leagueid: 0,
      positionid: 0,
      footid: 0,
      skillmoves: 1,
      weakfoot: 1,
      accelerateid: 0,
      height: 170,
      weight: 70,
      bodytypeid: 0,
      age: 20,
      rating: 75
    };
  
    onMount(async () => {
      console.log('Players component mounted');
      await Promise.all([
        fetchPlayers(),
        fetchTeams(),
        fetchCountries(),
        fetchLeagues(),
        fetchPositions(),
        fetchFeet(),
        fetchAcceleRATETypes(),
        fetchBodyTypes()
      ]);
      isLoading = false;
    });
  
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
  
    async function fetchTeams() {
      try {
        const response = await apiRequest('/api/teams');
        if (response.ok) {
          teams = await response.json();
        } else {
          console.error('Failed to fetch teams');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    }
  
    async function fetchCountries() {
      try {
        const response = await apiRequest('/api/countries');
        if (response.ok) {
          countries = await response.json();
        } else {
          console.error('Failed to fetch countries');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }
  
    async function fetchLeagues() {
      try {
        const response = await apiRequest('/api/leagues');
        if (response.ok) {
          leagues = await response.json();
        } else {
          console.error('Failed to fetch leagues');
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    }
  
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
  
    async function addPlayer() {
      try {
        const response = await apiRequest('/api/players', {
          method: 'POST',
          body: JSON.stringify(newPlayer)
        });
        if (response.ok) {
          const addedPlayer = await response.json();
          players = [...players, addedPlayer].sort((a, b) => a.name.localeCompare(b.name));
          resetNewPlayer();
        } else {
          console.error('Failed to add player');
        }
      } catch (error) {
        console.error('Error adding player:', error);
      }
    }
  
    async function updatePlayer(player: Player) {
      try {
        const response = await apiRequest('/api/players', {
          method: 'PUT',
          body: JSON.stringify(player)
        });
        if (response.ok) {
          const updatedPlayer = await response.json();
          players = players.map(p => p.playerid === updatedPlayer.playerid ? updatedPlayer : p)
                           .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update player');
        }
      } catch (error) {
        console.error('Error updating player:', error);
      }
    }
  
    async function deletePlayer(playerID: number) {
      try {
        const response = await apiRequest(`/api/players/${playerID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          players = players.filter(p => p.playerid !== playerID);
        } else {
          console.error('Failed to delete player');
        }
      } catch (error) {
        console.error('Error deleting player:', error);
      }
    }
  
    function resetNewPlayer() {
      newPlayer = {
        name: '',
        teamid: 0,
        nationid: 0,
        leagueid: 0,
        positionid: 0,
        footid: 0,
        skillmoves: 1,
        weakfoot: 1,
        accelerateid: 0,
        height: 170,
        weight: 70,
        bodytypeid: 0,
        age: 20,
        rating: 75
      };
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Players</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Nation</th>
            <th>League</th>
            <th>Position</th>
            <th>Foot</th>
            <th>Skill Moves</th>
            <th>Weak Foot</th>
            <th>AcceleRATE</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Body Type</th>
            <th>Age</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each players as player}
            <tr>
              <td contenteditable on:blur={() => updatePlayer(player)}>{player.name}</td>
              <td>
                <select bind:value={player.teamid} on:change={() => updatePlayer(player)}>
                  {#each teams as team}
                    <option value={team.teamid}>{team.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={player.nationid} on:change={() => updatePlayer(player)}>
                  {#each countries as country}
                    <option value={country.countryid}>{country.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={player.leagueid} on:change={() => updatePlayer(player)}>
                  {#each leagues as league}
                    <option value={league.leagueid}>{league.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={player.positionid} on:change={() => updatePlayer(player)}>
                  {#each positions as position}
                    <option value={position.positionid}>{position.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <select bind:value={player.footid} on:change={() => updatePlayer(player)}>
                  {#each feet as foot}
                    <option value={foot.footid}>{foot.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="number" bind:value={player.skillmoves} on:change={() => updatePlayer(player)} min="1" max="5" />
              </td>
              <td>
                <input type="number" bind:value={player.weakfoot} on:change={() => updatePlayer(player)} min="1" max="5" />
              </td>
              <td>
                <select bind:value={player.accelerateid} on:change={() => updatePlayer(player)}>
                  {#each acceleRATETypes as acceleRATEType}
                    <option value={acceleRATEType.accelerateid}>{acceleRATEType.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="number" bind:value={player.height} on:change={() => updatePlayer(player)} min="150" max="220" />
              </td>
              <td>
                <input type="number" bind:value={player.weight} on:change={() => updatePlayer(player)} min="50" max="120" />
              </td>
              <td>
                <select bind:value={player.bodytypeid} on:change={() => updatePlayer(player)}>
                  {#each bodyTypes as bodyType}
                    <option value={bodyType.bodytypeid}>{bodyType.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="number" bind:value={player.age} on:change={() => updatePlayer(player)} min="16" max="50" />
              </td>
              <td>
                <input type="number" bind:value={player.rating} on:change={() => updatePlayer(player)} min="0" max="99" />
              </td>
              <td>
                <button on:click={() => deletePlayer(player.playerid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Player</h3>
      <form on:submit|preventDefault={addPlayer}>
        <label>
          Name: <input type="text" bind:value={newPlayer.name} required />
        </label>
        <label>
          Team:
          <select bind:value={newPlayer.teamid} required>
            <option value="">Select a Team</option>
            {#each teams as team}
              <option value={team.teamid}>{team.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Nation:
          <select bind:value={newPlayer.nationid} required>
            <option value="">Select a Nation</option>
            {#each countries as country}
              <option value={country.countryid}>{country.name}</option>
            {/each}
          </select>
        </label>
        <label>
          League:
          <select bind:value={newPlayer.leagueid} required>
            <option value="">Select a League</option>
            {#each leagues as league}
              <option value={league.leagueid}>{league.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Position:
          <select bind:value={newPlayer.positionid} required>
            <option value="">Select a Position</option>
            {#each positions as position}
              <option value={position.positionid}>{position.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Foot:
          <select bind:value={newPlayer.footid} required>
            <option value="">Select a Foot</option>
            {#each feet as foot}
              <option value={foot.footid}>{foot.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Skill Moves: <input type="number" bind:value={newPlayer.skillmoves} min="1" max="5" required />
        </label>
        <label>
          Weak Foot: <input type="number" bind:value={newPlayer.weakfoot} min="1" max="5" required />
        </label>
        <label>
          AcceleRATE:
          <select bind:value={newPlayer.accelerateid} required>
            <option value="">Select AcceleRATE</option>
            {#each acceleRATETypes as acceleRATEType}
              <option value={acceleRATEType.accelerateid}>{acceleRATEType.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Height: <input type="number" bind:value={newPlayer.height} min="150" max="220" required />
        </label>
        <label>
          Weight: <input type="number" bind:value={newPlayer.weight} min="50" max="120" required />
        </label>
        <label>
          Body Type:
          <select bind:value={newPlayer.bodytypeid} required>
            <option value="">Select Body Type</option>
            {#each bodyTypes as bodyType}
              <option value={bodyType.bodytypeid}>{bodyType.name}</option>
            {/each}
          </select>
        </label>
        <label>
          Age: <input type="number" bind:value={newPlayer.age} min="16" max="50" required />
        </label>
        <label>
          Rating: <input type="number" bind:value={newPlayer.rating} min="0" max="99" required />
        </label>
        <button type="submit">Add Player</button>
      </form>
    </div>
  {/if}