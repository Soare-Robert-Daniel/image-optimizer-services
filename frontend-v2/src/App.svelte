<script>
  import { onDestroy, onMount } from "svelte";
  import Sidebar from "./Sidebar.svelte";
  import { userStore } from "./stores";

  export let name;

  let serverData = [];
  let currentUser = {}
  const unsubscribe = userStore.subscribe(value => {
    currentUser = value
  })

  let imgInput = "";
  let imgWInput = 300;
  let imgHInput = 300;

  let userKey = "";
  let userId = "";

  $: console.log(serverData);

  const apiKey =
    "ec799e7a8cfc59e4e40cedfc678191d8db50bd394a5b9724a19eab9747c34a72";

  function addOptimoleDataOnLink(link) {
    return `https://${currentUser.key}.r.optml.cloud/w:${imgWInput}/h:${imgHInput}/${link}`;
  }

  async function addImg() {
    if( !imgInput && !currentUser.id ) {
      return
    }
    const res = await fetch("http://localhost:8500/v1/image/add", {
      method: "post",
      body: JSON.stringify({
        original_src: imgInput,
        optm_src: addOptimoleDataOnLink(imgInput),
        user_id: currentUser.id
      }),
    });

    if (res.status === 200) {
      const imgList = await res.json();
      if (imgList) {
        serverData = [
          ...imgList.filter((img) => img.original_src && img.optm_src),
          ...serverData,
        ];
      }
    }
    imgInput = "";
  }

  function removeImgOnClick(imgId) {
    return () => {
      serverData = serverData.filter(({ id }) => id !== imgId);
      fetch(`http://localhost:8500/v1/image/delete/${imgId}`, {
        method: "delete",
      });
    };
  }

  async function fetchUserImages() {
    const res = await fetch(`http://localhost:8500/v1/images/${currentUser.id}`);

    if (res.status === 200) {
      const imgList = await res.json();
      console.log(imgList);
      if (imgList) {
        serverData = imgList
          .filter((img) => img.original_src && img.optm_src)
          .reverse();
      }
    }
  }

  $: currentUser.id && fetchUserImages();

  $: console.log(currentUser)

  onMount(async () => {
    const res = await fetch("http://localhost:8500/v1/images");

    if (res.status === 200) {
      const imgList = await res.json();
      console.log(imgList);
      if (imgList) {
        serverData = imgList
          .filter((img) => img.original_src && img.optm_src)
          .reverse();
      }
    }
  });

  onDestroy(unsubscribe)
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
    how to build Svelte apps.
  </p>

  <div class="container">
    <Sidebar />
    <div class="content">
      <div class="main-form">
        <div class="input-form">
          <label for="img-input-link"> Link </label>
          <input
            bind:value={imgInput}
            placeholder={ currentUser?.name ? `Add a link for ${currentUser.name}` : "Create a new user and select it!!!" }
            name="img-input-link"
            class="img-input-link"
          />
          <label for="img-input-w"> W: </label>
          <input
            bind:value={imgHInput}
            name="img-input-w"
            class="img-input-size"
          />
          <label for="img-input-h"> H: </label>
          <input
            bind:value={imgWInput}
            name="img-input-h"
            class="img-input-size"
          />
          <button class="btn-add" on:click={addImg}> Add link </button>
        </div>
      </div>
      <div class="image-list-containers">
        {#each serverData as imgData}
          <div class="image-container">
            <div class="info">
              <div class="src-link">
                <p>Link: <a href={imgData.optm_src}>{imgData.optm_src}</a></p>
              </div>
              <div class="actions">
                <button
                  class="btn-delete"
                  on:click={removeImgOnClick(imgData.id)}>Delete</button
                >
              </div>
            </div>
            <img src={imgData.optm_src} alt="optimize" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;

    h1 {
      color: #ff3e00;
      text-transform: uppercase;
      font-size: 4em;
      font-weight: 100;
    }

    .container {
      display: flex;
      flex-direction: row;

      .content {
        width: 80%;
        .main-form {
          border: 1px solid black;
          padding: 20px;
          border-radius: 10px;
          width: max(300px, 50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 70%;

          .input-form {
            display: flex;
            flex-direction: row;
            align-items: center;

            label {
              font-size: 1.4rem;
              display: block;
              width: max-content;
            }

            .img-input-link {
              margin: 0px 10px;
              width: max(550px, 70%);
            }

            .img-input-size {
              margin: 0px 10px;
              width: max(100px, 10%);
            }

            .btn-add {
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
              border: 2px solid #4caf50;

              &:hover {
                background-color: #4caf50;
                color: white;
              }
            }
          }
        }

        .image-list-containers {
          margin-top: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: max-content;
          min-width: 450px;
          padding: 10px;

          .image-container {
            min-width: 100px;
            max-width: 800px;
            box-shadow: 0 10px 16px 0 rgb(0 0 0 / 20%),
              0 6px 20px 0 rgb(0 0 0 / 19%);
            padding: 0px;
            margin-bottom: 30px;

            .info {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              padding: 10px;

              .actions {
                padding: 0px 30px;

                .btn-delete {
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
                  border: 2px solid #f44336;

                  &:hover {
                    background-color: #f44336;
                    color: white;
                  }
                }
              }
            }

            img {
              max-width: 700px;
              padding: 0px;
              margin: 0px;
            }
          }
        }
      }
    }
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
