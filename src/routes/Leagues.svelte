<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type League = {
      leagueid: number;
      name: string;
      countryid: number;
    };
  
    type Country = {
      countryid: number;
      name: string;
    };
  
    let leagues: League[] = [];
    let countries: Country[] = [];
    let isLoading = true;
    let newLeague: Omit<League, 'leagueid'> = {
      name: '',
      countryid: 0
    };
  
    onMount(async () => {
      console.log('Leagues component mounted');
      await Promise.all([fetchLeagues(), fetchCountries()]);
      isLoading = false;
    });
  
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
  
    async function addLeague() {
      try {
        const response = await apiRequest('/api/leagues', {
          method: 'POST',
          body: JSON.stringify(newLeague)
        });
        if (response.ok) {
          const addedLeague = await response.json();
          leagues = [...leagues, addedLeague].sort((a, b) => a.name.localeCompare(b.name));
          newLeague = { name: '', countryid: 0 };
        } else {
          console.error('Failed to add league');
        }
      } catch (error) {
        console.error('Error adding league:', error);
      }
    }
  
    async function updateLeague(league: League) {
      try {
        const response = await apiRequest('/api/leagues', {
          method: 'PUT',
          body: JSON.stringify(league)
        });
        if (response.ok) {
          const updatedLeague = await response.json();
          leagues = leagues.map(l => l.leagueid === updatedLeague.leagueid ? updatedLeague : l)
                           .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update league');
        }
      } catch (error) {
        console.error('Error updating league:', error);
      }
    }
  
    async function deleteLeague(leagueID: number) {
      try {
        const response = await apiRequest(`/api/leagues/${leagueID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          leagues = leagues.filter(l => l.leagueid !== leagueID);
        } else {
          console.error('Failed to delete league');
        }
      } catch (error) {
        console.error('Error deleting league:', error);
      }
    }
  
    function getCountryName(countryId: number): string {
      return countries.find(c => c.countryid === countryId)?.name || 'Unknown Country';
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Leagues</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each leagues as league}
            <tr>
              <td>{league.leagueid}</td>
              <td contenteditable on:blur={() => updateLeague(league)}>{league.name}</td>
              <td>
                <select bind:value={league.countryid} on:change={() => updateLeague(league)}>
                  {#each countries as country}
                    <option value={country.countryid}>{country.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <button on:click={() => deleteLeague(league.leagueid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New League</h3>
      <form on:submit|preventDefault={addLeague}>
        <label>
          Name:
          <input type="text" bind:value={newLeague.name} required />
        </label>
        <label>
          Country:
          <select bind:value={newLeague.countryid} required>
            <option value="">Select a Country</option>
            {#each countries as country}
              <option value={country.countryid}>{country.name}</option>
            {/each}
          </select>
        </label>
        <button type="submit">Add League</button>
      </form>
    </div>
  {/if}