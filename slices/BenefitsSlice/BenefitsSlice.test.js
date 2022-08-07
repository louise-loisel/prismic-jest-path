import { mount } from '@vue/test-utils'
import BenefitsSlice from '../BenefitsSlice/BenefitsSlice.vue'

describe('BenefitsSlice', () => {
  it('should render without error', () => {
    mount(BenefitsSlice, {
      propsData: {
        slice: { primary: { title: 'title', description: 'description' } },
        index: 1,
        slices: [],
        context: null,
      },
    })
  })
})
