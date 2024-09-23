<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Team = {
      teamid: number;
      name: string;
      leagueid: number;
    };
  
    type League = {
      leagueid: number;
      name: string;
    };
  
    let teams: Team[] = [];
    let leagues: League[] = [];
    let isLoading = true;
    let newTeam: Omit<Team, 'teamid'> = {
      name: '',
      leagueid: 0
    };
  
    onMount(async () => {
      console.log('Teams component mounted');
      await Promise.all([fetchTeams(), fetchLeagues()]);
      isLoading = false;
    });
  
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
  
    async function addTeam() {
      try {
        const response = await apiRequest('/api/teams', {
          method: 'POST',
          body: JSON.stringify(newTeam)
        });
        if (response.ok) {
          const addedTeam = await response.json();
          teams = [...teams, addedTeam].sort((a, b) => a.name.localeCompare(b.name));
          newTeam = { name: '', leagueid: 0 };
        } else {
          console.error('Failed to add team');
        }
      } catch (error) {
        console.error('Error adding team:', error);
      }
    }
  
    async function updateTeam(team: Team) {
      try {
        const response = await apiRequest('/api/teams', {
          method: 'PUT',
          body: JSON.stringify(team)
        });
        if (response.ok) {
          const updatedTeam = await response.json();
          teams = teams.map(t => t.teamid === updatedTeam.teamid ? updatedTeam : t)
                       .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update team');
        }
      } catch (error) {
        console.error('Error updating team:', error);
      }
    }
  
    async function deleteTeam(teamID: number) {
      try {
        const response = await apiRequest(`/api/teams/${teamID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          teams = teams.filter(t => t.teamid !== teamID);
        } else {
          console.error('Failed to delete team');
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  
    function getLeagueName(leagueId: number): string {
      return leagues.find(l => l.leagueid === leagueId)?.name || 'Unknown League';
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Teams</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>League</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each teams as team}
            <tr>
              <td>{team.teamid}</td>
              <td contenteditable on:blur={() => updateTeam(team)}>{team.name}</td>
              <td>
                <select bind:value={team.leagueid} on:change={() => updateTeam(team)}>
                  {#each leagues as league}
                    <option value={league.leagueid}>{league.name}</option>
                  {/each}
                </select>
              </td>
              <td>
                <button on:click={() => deleteTeam(team.teamid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Team</h3>
      <form on:submit|preventDefault={addTeam}>
        <label>
          Name:
          <input type="text" bind:value={newTeam.name} required />
        </label>
        <label>
          League:
          <select bind:value={newTeam.leagueid} required>
            <option value="">Select a League</option>
            {#each leagues as league}
              <option value={league.leagueid}>{league.name}</option>
            {/each}
          </select>
        </label>
        <button type="submit">Add Team</button>
      </form>
    </div>
  {/if}