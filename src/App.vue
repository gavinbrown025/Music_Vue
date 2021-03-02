<template>
  <div id="app">
    <main>
      <section class="player">
        <h2 class="song-title">
          {{current.artist}}
          <br />
          {{current.title}}
        </h2>
        <div class="controls">
          <img src="./assets/prev.svg" class="prev" @click="prev" />
          <img src="./assets/play.svg" class="play" @click="play" v-if="!isPlaying" />
          <img src="./assets/pause.svg" class="pause" @click="pause" v-else />
          <img src="./assets/next.svg" class="next" @click="next" />
        </div>
      </section>

      <section class="playlist">
        <h3>Playlist</h3>
        <div
          v-for="song in songs"
          :key="song.src"
          @click="play(song)"
          :class="(song.src == current.src) ? 'song playing' : 'song' "
        >
          <p>{{song.artist}} - {{song.title}}</p>
        </div>
      </section>
    </main>

    <footer></footer>
  </div>
</template>

<script>
import { fetchData } from "./api/DataMiner.js";

export default {
  name: "App",

  data() {
    return {
      current: {},
      index: 0,
      isPlaying: false,
      songs: [
        {
          title: "ANVIL",
          artist: "LORN",
          src: require("./assets/LORN-ANVIL.mp3"),
        },
        {
          title: "March of Progress",
          artist: "MALO",
          src: require("./assets/MALO-March_of_Progress.mp3"),
        },
        {
          title: "Bury",
          artist: "Mire",
          src: require("./assets/Lorn-Bury.mp3"),
        },
      ],
      player: new Audio(),
    };
  },

  created() {
    this.current = this.songs[this.index];
    this.player.src = this.current.src;
  },
  mounted() {
    fetchData(`https://deezerdevs-deezer.p.rapidapi.com/search?q=periphery`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "d55cc2858emshaf6c4e0c55f5035p1894a7jsn1f499c69d3bb",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((data) => {
        data.forEach((song) => {
          console.log(song);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  methods: {
    play(song) {
      if (typeof song.src != "undefined") {
        this.current = song;
        this.player.src = this.current.src;
      }
      this.player.play();
      this.player.addEventListener("ended", this.next);

      this.isPlaying = true;
    },
    pause() {
      this.player.pause();
      this.isPlaying = false;
    },
    next() {
      this.index++;
      if (this.index >= this.songs.length - 1) {
        this.index = 0;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    },
    prev() {
      this.index--;
      if (this.index < 0) {
        this.index = this.songs.length - 1;
      }
      this.current = this.songs[this.index];
      this.play(this.current);
    },
    timeTrack() {},
  },
};
</script>

<style lang="scss">
@import "./assets/sass/style.scss";

// header {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 1rem;
//   background-color: $grey;
//   color: white;
// }

.player {
  padding: 3rem;
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: url("./assets/background.jpg") bottom left / cover;

  .song-title {
    text-align: center;
    color: white;
    text-shadow: 0 0 5rem rgba(0, 0, 0, 0.8);
  }
  .controls {
    width: 33%;
    min-width: 300px;
    height: 5rem;
    display: flex;
    justify-content: space-evenly;
    img {
      height: 100%;
      transition: all 200ms ease-out;
      cursor: pointer;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}

.playlist {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: $dk-blue;
  color: $black;
  h3 {
    font-size: 2rem;
    font-weight: bold;
    padding-bottom: 1rem;
  }
  .song {
    padding: 1rem 0;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid $white;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    p {
      padding: 0 1rem;
    }
  }
}
footer {
  height: 4rem;
  background: $grey;
}
</style>
