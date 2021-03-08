<template>
  <div id="app">
    <main>
      <section class="player">
        <h2 v-if="songs.length" class="song-title">{{current.artist.name}} - {{current.title}}</h2>
        <h2 class="song-title" v-else>Search for Songs below</h2>

        <div class="song-img">
          <img v-if="current.album" :src="current.album.cover_big" alt />
        </div>

        <div class="controls">
          <img src="./assets/prev.svg" class="prev" @click="prev" />
          <img src="./assets/play.svg" class="play" @click="play" v-if="!isPlaying" />
          <img src="./assets/pause.svg" class="pause" @click="pause" v-else />
          <img src="./assets/next.svg" class="next" @click="next" />
        </div>

        <div class="song-time">
          <span class="time">{{ getCurrentTime(currentTime) }}</span>
          <input type="range" value="0" class="time-bar" ref="timePos" />
          <span class="time">{{ getCurrentTime(current.duration) }}</span>
        </div>
      </section>

      <form @submit.prevent="search" class="search-con">
        <input v-model="query" type="text" class="searchbar" placeholder="i.e beatles" />
        <button type="submit">search</button>
      </form>

      <section class="playlist">
        <div
          v-for="song in songs"
          :key="song.id"
          @click="play(song)"
          :class="(song.id == current.id) ? 'song playing' : 'song' "
        >
          <p>{{song.artist.name}} - {{song.title}}</p>
          <span>{{getCurrentTime(song.duration)}}</span>
        </div>
      </section>

      <!-- <playlist @play="junk(x)" :songs="songs" :current="current"></playlist> -->
    </main>

    <footer></footer>
  </div>
</template>
<script>
import { fetchData } from "./api/DataMiner.js";
import Playlist from "./components/Playlist";

export default {
  name: "App",

  data() {
    return {
      current: {},
      index: 0,
      isPlaying: false,
      songs: [],
      player: new Audio(),
      query: "",
      currentTime: 0,
    };
  },

  mounted() {
    this.addEventListener();
  },

  methods: {
    junk(x) {
      console.log(x);
    },
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
      this.$refs.timePos.value =
        (this.player.currentTime / this.current.duration) * 100;

      this.currentTime = this.player.currentTime;
    },
    updatePlayTime(e) {
      let scrubTime = (e.target.value * this.current.duration) / 100;
      this.player.currentTime = scrubTime;
    },
    addEventListener() {
      this.player.addEventListener("timeupdate", this.timeTrack);
      this.$refs.timePos.addEventListener("input", this.updatePlayTime);
    },
  },
  components: {
    Playlist,
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/style.scss";

.player {
  padding: 3rem;
  display: grid;
  grid-template-rows: auto 1fr repeat(2, auto);
  place-items: center;
  min-height: 100vh;
  background: url("./assets/background.jpg") bottom left / cover;

  .song-title {
    text-align: center;
    color: white;
    text-shadow: 0 0 5rem rgba(0, 0, 0, 0.8);
  }
  .song-img img {
    box-shadow: $shadow;
    max-width: 50vw;
    max-height: 40vh;
  }

  .controls {
    width: 33%;
    min-width: 300px;
    padding-bottom: 1rem;
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
    padding: 0.5rem;
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $white;
    .time {
      min-width: 4rem;
      margin-left: 0.5rem;
    }
    input[type="range"] {
      flex-grow: 1;
      height: 4px;
    }
  }
}
.search-con {
  background: $dk-blue;
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
  .searchbar {
    min-width: 100px;

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
      background: $highlight;
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

@media screen and(max-width: 700px) {
  .player .song-time {
    width: 100%;
  }
}
@media screen and(max-width: 400px) {
  .player {
    padding: 3rem 1rem;
    .song-img img {
      max-width: 66vw;
    }
  }
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;

  &::-webkit-slider-thumb {
    margin: -0.25rem;
    @include thumb();
  }
  &::-moz-range-thumb {
    @include thumb();
  }
  &::-ms-thumb {
    @include thumb();
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgb(0, 94, 55);
  }

  &::-webkit-slider-runnable-track {
    @include track();
  }

  &::-moz-range-track {
    @include track();
  }
}
</style>
