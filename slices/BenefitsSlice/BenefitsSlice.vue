<template>
  <section>
    <PrismicRichText :field="slice.primary.title" />
    <PrismicRichText :field="slice.primary.description" />
  </section>
</template>

<script>
import { getSliceComponentProps } from '@prismicio/vue/components'

export default {
  name: 'BenefitsSlice',
  props: getSliceComponentProps(),
}
</script>
