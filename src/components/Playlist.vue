<template>
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
</template>

<script>
export default {
  props: ["songs", "current"],

  methods: {
    play(x) {
      this.$emit("play", x);
    },
    getCurrentTime(time) {
      let min = Math.floor(time / 60);
      let sec = Math.floor(time - min * 60);
      sec = sec > 9 ? sec : `0${sec}`;
      min = min > 9 ? min : `0${min}`;
      let formatTime = `${min}:${sec}`;
      return formatTime;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/style.scss";
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
</style>