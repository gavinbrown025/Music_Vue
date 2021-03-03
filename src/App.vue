<template>
  <div id="app">
    <main>
      <section class="player">
        <h2 v-if="songs.length>0" class="song-title">
          {{current.artist.name}}
          <br />
          {{current.title}}
        </h2>
        <h2 class="song-title" v-else>Search for Songs below</h2>
        <div class="controls">
          <img src="./assets/prev.svg" class="prev" @click="prev" />
          <img src="./assets/play.svg" class="play" @click="play" v-if="!isPlaying" />
          <img src="./assets/pause.svg" class="pause" @click="pause" v-else />
          <img src="./assets/next.svg" class="next" @click="next" />
        </div>

        <div class="song-time">
          <span class="cur-time">{{ getCurrentTime(currentTime) }}</span>
          <input type="range" value="0" class="time-bar" ref="timePos" />
          <span class="dur-time">{{ getCurrentTime(current.duration) }}</span>
        </div>
      </section>

      <form @submit.prevent="search" class="search-con">
        <!-- <h3>Queue</h3> -->
        <input v-model="query" type="text" class="searchbar" placeholder="i.e beatles" />
        <button type="submit">search</button>
      </form>

      <section class="playlist">
        <div
          v-for="song in songs"
          :key="song.id"
          @click="play(song)"
          :class="(song.preview == current.preview) ? 'song playing' : 'song' "
        >
          <p>{{song.artist.name}} - {{song.title}}</p>
          <span>{{getCurrentTime(song.duration)}}</span>
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
      songs: [],
      player: new Audio(),
      query: "slaves",
      currentTime: 0,
      durationTime: 0,
    };
  },

  created() {},
  mounted() {
    this.addEventListener();
  },
  updated() {},

  methods: {
    search(e) {
      fetchData(
        `https://deezerdevs-deezer.p.rapidapi.com/search?q=${this.query}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "d55cc2858emshaf6c4e0c55f5035p1894a7jsn1f499c69d3bb",
            "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
          },
        }
      )
        .then((data) => {
          this.songs = data;
          this.current = this.songs[this.index];
          this.player.src = this.current.preview;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    play(song) {
      if (typeof song.preview != "undefined") {
        this.current = song;
        this.player.src = this.current.preview;
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
    removeSong(e) {
      this.songs = this.songs.filter((song) => song.id !== e.id);
    },
    getCurrentTime(time) {
      let minute = Math.floor(time / 60);
      let second = Math.floor(time - minute * 60);
      second = second > 9 ? second : `0${second}`;
      minute = minute > 9 ? minute : `0${minute}`;
      let formatTime = `${minute}:${second}`;
      return formatTime;
    },
    timeTrack() {
      let musicRange = this.$refs.timePos;

      musicRange.value =
        (this.player.currentTime / this.current.duration) * 100;

      this.currentTime = this.player.currentTime;
    },
    addEventListener() {
      this.player.addEventListener("timeupdate", this.timeTrack);
    },
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
      opacity: 0.8;
      height: 100%;
      transition: all 100ms ease-out;
      cursor: pointer;
      &:hover {
        opacity: 1;
        transform: scale(1.05);
      }
    }
  }
  .song-time {
    @include copyFont();
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $white;
    .time-bar {
      flex-grow: 1;
      background: rgba(255, 255, 255, 0.3);
      margin: 1rem;
      height: 4px;
      .time {
        background: #fff;
      }
    }
  }
}
.search-con {
  background: $dk-blue;
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  h3 {
    flex-grow: 1;
  }
  .searchbar {
    @include copyFont(1.8rem);
    text-transform: uppercase;
    color: $white;
    background-color: transparent;
    border: none;
    border-bottom: 1px $white solid;
    font-weight: bold;
    padding: 0.5rem;
    outline: none;
    &::placeholder {
      text-transform: lowercase;
      color: $white;
      opacity: 0.9;
    }
    &:hover,
    &:focus {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  button {
    @include copyFont();
    text-transform: uppercase;
    align-self: stretch;
    background: $black;
    border: none;
    color: $white;
    padding: 1rem;
    cursor: pointer;
    outline: inherit;
    &:hover,
    &:focus {
      background-color: $grey;
    }
  }
}

.playlist {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  background: $dk-blue;
  .song {
    display: flex;
    padding: 1rem 0;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid $white;
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    &.playing {
      background: rgb(31, 153, 143);
    }
    p {
      flex-grow: 1;
      padding: 0 1rem;
    }
    span {
      opacity: 0.8;
      @include copyFont();
      margin-right: 1rem;
      &:hover {
        opacity: 1;
      }
    }
  }
}
footer {
  height: 4rem;
  background: $grey;
}
</style>
