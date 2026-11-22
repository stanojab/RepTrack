import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AdherenceBar from '../src/components/AdherenceBar.vue';

describe('AdherenceBar (US-08)', () => {
  it('shows "2 of 3 workouts (67 %)"', () => {
    const wrapper = mount(AdherenceBar, { props: { adherence: { logged: 2, planned: 3, percent: 67 } } });
    expect(wrapper.text()).toContain('2 of 3 workouts (67 %)');
    expect(wrapper.find('.bar i').attributes('style')).toContain('width: 67%');
  });

  it('shows a message when the client has no active plan', () => {
    const wrapper = mount(AdherenceBar, { props: { adherence: { logged: 0, planned: 0, percent: null } } });
    expect(wrapper.text()).toBe('No active plan');
  });
});
