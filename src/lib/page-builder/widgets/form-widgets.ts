/**
 * Form Widgets - Contact Forms, Newsletter, Search, etc.
 */

import { z } from 'zod'
import { componentRegistry } from '../component-registry'

/**
 * CONTACT FORM WIDGET
 */
componentRegistry.register({
  type: 'contact-form',
  label: 'Contact Form',
  icon: 'Mail',
  category: 'form',
  description: 'Contact form with name, email, message fields',
  tags: ['form', 'contact', 'email', 'message'],

  defaultProps: {
    title: 'Get In Touch',
    subtitle: "Fill out the form below and we'll get back to you soon",
    submitButtonText: 'Send Message',
    submitButtonVariant: 'primary',
    showNameField: true,
    showEmailField: true,
    showPhoneField: true,
    showSubjectField: true,
    showMessageField: true,
    nameLabel: 'Your Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'john@example.com',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+1 (555) 000-0000',
    subjectLabel: 'Subject',
    subjectPlaceholder: 'How can we help?',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us more...',
    successMessage: "Thank you! We'll be in touch soon.",
    errorMessage: 'Something went wrong. Please try again.',
    apiEndpoint: '/api/contact',
    layout: 'stacked', // stacked | two-column
    fieldSpacing: 'medium',
    labelPosition: 'top' // top | left | floating
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    submitButtonText: z.string(),
    submitButtonVariant: z.string().optional(),
    showNameField: z.boolean().optional(),
    showEmailField: z.boolean().optional(),
    showPhoneField: z.boolean().optional(),
    showSubjectField: z.boolean().optional(),
    showMessageField: z.boolean().optional(),
    nameLabel: z.string().optional(),
    namePlaceholder: z.string().optional(),
    emailLabel: z.string().optional(),
    emailPlaceholder: z.string().optional(),
    phoneLabel: z.string().optional(),
    phonePlaceholder: z.string().optional(),
    subjectLabel: z.string().optional(),
    subjectPlaceholder: z.string().optional(),
    messageLabel: z.string().optional(),
    messagePlaceholder: z.string().optional(),
    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
    apiEndpoint: z.string(),
    layout: z.enum(['stacked', 'two-column']).optional(),
    fieldSpacing: z.enum(['compact', 'medium', 'spacious']).optional(),
    labelPosition: z.enum(['top', 'left', 'floating']).optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Form Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'submitButtonText', label: 'Submit Button Text', type: 'text', required: true }
      ]
    },
    {
      id: 'fields',
      label: 'Form Fields',
      fields: [
        { name: 'showNameField', label: 'Show Name Field', type: 'toggle' },
        { name: 'showEmailField', label: 'Show Email Field', type: 'toggle' },
        { name: 'showPhoneField', label: 'Show Phone Field', type: 'toggle' },
        { name: 'showSubjectField', label: 'Show Subject Field', type: 'toggle' },
        { name: 'showMessageField', label: 'Show Message Field', type: 'toggle' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        {
          name: 'layout',
          label: 'Layout',
          type: 'select',
          options: [
            { label: 'Stacked', value: 'stacked' },
            { label: 'Two Column', value: 'two-column' }
          ]
        },
        {
          name: 'fieldSpacing',
          label: 'Field Spacing',
          type: 'select',
          options: [
            { label: 'Compact', value: 'compact' },
            { label: 'Medium', value: 'medium' },
            { label: 'Spacious', value: 'spacious' }
          ]
        },
        {
          name: 'labelPosition',
          label: 'Label Position',
          type: 'select',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Left', value: 'left' },
            { label: 'Floating', value: 'floating' }
          ]
        },
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text', required: true }
      ]
    }
  ]
})

/**
 * NEWSLETTER SUBSCRIBE WIDGET
 */
componentRegistry.register({
  type: 'newsletter',
  label: 'Newsletter',
  icon: 'Mail',
  category: 'form',
  description: 'Email newsletter subscription form',
  tags: ['newsletter', 'subscribe', 'email', 'signup'],

  defaultProps: {
    title: 'Subscribe to Our Newsletter',
    description: 'Get the latest updates delivered to your inbox',
    emailPlaceholder: 'Enter your email',
    buttonText: 'Subscribe',
    buttonVariant: 'primary',
    layout: 'inline', // inline | stacked
    showNameField: false,
    apiEndpoint: '/api/newsletter',
    successMessage: 'Thanks for subscribing!',
    gdprText: 'By subscribing, you agree to our Privacy Policy',
    showGdprCheckbox: true
  },

  propsSchema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    emailPlaceholder: z.string(),
    buttonText: z.string(),
    buttonVariant: z.string().optional(),
    layout: z.enum(['inline', 'stacked']).optional(),
    showNameField: z.boolean().optional(),
    apiEndpoint: z.string(),
    successMessage: z.string().optional(),
    gdprText: z.string().optional(),
    showGdprCheckbox: z.boolean().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'emailPlaceholder', label: 'Email Placeholder', type: 'text' },
        { name: 'buttonText', label: 'Button Text', type: 'text' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        {
          name: 'layout',
          label: 'Layout',
          type: 'select',
          options: [
            { label: 'Inline', value: 'inline' },
            { label: 'Stacked', value: 'stacked' }
          ]
        },
        { name: 'showNameField', label: 'Show Name Field', type: 'toggle' },
        { name: 'showGdprCheckbox', label: 'Show GDPR Checkbox', type: 'toggle' },
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text' }
      ]
    }
  ]
})

/**
 * SEARCH WIDGET
 */
componentRegistry.register({
  type: 'search',
  label: 'Search',
  icon: 'Search',
  category: 'form',
  description: 'Search form with autocomplete',
  tags: ['search', 'find', 'filter'],

  defaultProps: {
    placeholder: 'Search...',
    buttonText: 'Search',
    showButton: true,
    enableAutocomplete: true,
    searchUrl: '/search',
    autocompleteUrl: '/api/search/autocomplete',
    minCharacters: 3,
    maxSuggestions: 5,
    size: 'medium', // small | medium | large
    variant: 'default' // default | minimal | filled
  },

  propsSchema: z.object({
    placeholder: z.string(),
    buttonText: z.string().optional(),
    showButton: z.boolean().optional(),
    enableAutocomplete: z.boolean().optional(),
    searchUrl: z.string(),
    autocompleteUrl: z.string().optional(),
    minCharacters: z.number().optional(),
    maxSuggestions: z.number().optional(),
    size: z.enum(['small', 'medium', 'large']).optional(),
    variant: z.enum(['default', 'minimal', 'filled']).optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'placeholder', label: 'Placeholder Text', type: 'text' },
        { name: 'buttonText', label: 'Button Text', type: 'text' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        { name: 'showButton', label: 'Show Search Button', type: 'toggle' },
        { name: 'enableAutocomplete', label: 'Enable Autocomplete', type: 'toggle' },
        { name: 'searchUrl', label: 'Search Results URL', type: 'text' },
        { name: 'autocompleteUrl', label: 'Autocomplete API', type: 'text' },
        { name: 'minCharacters', label: 'Min Characters', type: 'number' },
        { name: 'maxSuggestions', label: 'Max Suggestions', type: 'number' }
      ]
    }
  ]
})
