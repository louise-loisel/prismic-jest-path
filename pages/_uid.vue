<script>
import { components } from '~/slices'

export default {
  async asyncData({ $prismic, error }) {
    const [document, header] = await Promise.all([
      $prismic.api.getSingle('single-page'),
    ])

    if ((document, header)) {
      return { document, header }
    } else {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  data() {
    return {
      components,
    }
  },
}
</script>

<template>
  <div>
    <div class="sticky">
      <SliceZone :slices="header.data.slices" :components="components" />
    </div>
    <SliceZone :slices="document.data.slices" :components="components" />
  </div>
</template>

<style>
.sticky {
  position: sticky;
  top: 0;
  left: 0;
}
</style>
