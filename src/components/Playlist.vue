<template>
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
</template>

<script>
export default {
  name: "playlist",
  data() {
    return {};
  },
};
</script>

<style>
</style>