<script>
  import { onMount } from "svelte";

  import { userStore } from "./stores";
  let userNameInput = "";
  let userKeyInput = "";
  let users = [];

  async function addUser() {
    const res = await fetch("http://localhost:8500/v1/user/add", {
      method: "post",
      body: JSON.stringify({
        user_name: userNameInput,
        user_key: userKeyInput,
      }),
    });

    if (res.status === 200) {
      const userList = await res.json();
      if (userList) {
        users = [
          ...userList.filter((user) => user.user_name && user.user_key),
          ...users,
        ];
      }
    }
    userNameInput = "";
    userKeyInput = "";
  }

  function deleteUser(userId) {
    return () => {
      users = users.filter(({ id }) => id !== userId);
      fetch(`http://localhost:8500/v1/user/delete/${userId}`, {
        method: "delete",
      });
    };
  }

  async function fetchUsers() {
    const res = await fetch("http://localhost:8500/v1/users");

    if (res.status === 200) {
      const userList = await res.json();
      if (userList) {
        users = userList
          .filter((user) => user.user_name && user.user_key)
          .reverse();
      }
    }
  }

  function selectUser(user) {
    userStore.set({
      key: user.user_key,
      id: user.id,
      name: user.user_name
    });
  }

  onMount(() => {
    fetchUsers();
  });
</script>

<div class="sidebar">
  <div class="options">
    <div class="input-option">
      <div class="form">
        <input bind:value={userNameInput} placeholder="User Name" />
        <input bind:value={userKeyInput} placeholder="User Key" />
      </div>
      <button on:click={addUser} class="btn-add"> Add User </button>
    </div>
    {#each users as user}
      <div class="option">
        <button on:click={deleteUser(user.id)} class="btn-delete">
          X
        </button>
        <button on:click={selectUser(user)} class="btn-profile">
          {user.user_name}
        </button>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .sidebar {
    width: 20%;
    margin-right: 30px;
    padding: 5px;

    .options {
      display: flex;
      flex-direction: column;
      align-items: center;

      .input-option {
        border-bottom: 5px solid #4c77af;
        margin-bottom: 10px;

        .btn-add {
          min-width: 100px;
          border: none;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          transition-duration: 0.4s;
          cursor: pointer;
          background-color: white;
          color: black;
          border: 2px solid #6e29ee;

          &:hover {
            background-color: #6e29ee;
            color: white;
          }
        }
      }

      .option {
        display: flex;
        flex-direction: row;
        .btn-profile, .btn-delete {
          min-width: 100px;
          border: none;
          padding: 8px 16px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          transition-duration: 0.4s;
          cursor: pointer;
          background-color: white;
          color: black;
          border: 2px solid #4c77af;

          &:hover {
            background-color: #4c77af;
            color: white;
          }
        }

        .btn-delete {
          border: 2px solid #e01616;
          min-width: 10px;

          &:hover {
            background-color: #e01616;
          }
        }
      }
    }
  }
</style>
