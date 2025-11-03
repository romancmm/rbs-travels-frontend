/**
 * Test data for page builder
 * This file contains sample page content for testing
 */

import type { PageContent } from '@/types/page-builder'

export const samplePageContent: PageContent = {
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      order: 0,
      settings: {
        background: {
          color: '#f5f5f5',
          image: '/hero.jpg'
        },
        padding: {
          top: '80px',
          bottom: '80px'
        }
      },
      rows: [
        {
          id: 'row-1',
          order: 0,
          settings: {
            columnsGap: '30px'
          },
          columns: [
            {
              id: 'col-1',
              width: 8,
              order: 0,
              components: [
                {
                  id: 'comp-1',
                  type: 'heading',
                  order: 0,
                  props: {
                    text: 'Welcome to Our Agency',
                    level: 'h1',
                    alignment: 'left'
                  }
                }
              ]
            },
            {
              id: 'col-2',
              width: 2,
              order: 1,
              components: [
                {
                  id: 'comp-2',
                  type: 'image',
                  order: 0,
                  props: {
                    src: '/hero-image.jpg',
                    alt: 'Hero image'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      name: 'Features Section',
      order: 1,
      settings: {
        background: {
          color: '#ffffff'
        },
        padding: {
          top: '60px',
          bottom: '60px'
        }
      },
      rows: [
        {
          id: 'row-2',
          order: 0,
          settings: {
            columnsGap: '30px'
          },
          columns: [
            {
              id: 'col-3',
              width: 4,
              order: 0,
              components: [
                {
                  id: 'comp-3',
                  type: 'heading',
                  order: 0,
                  props: {
                    text: 'Feature 1',
                    level: 'h3',
                    alignment: 'center'
                  }
                },
                {
                  id: 'comp-4',
                  type: 'text',
                  order: 1,
                  props: {
                    text: 'Description of feature 1',
                    alignment: 'center'
                  }
                }
              ]
            },
            {
              id: 'col-4',
              width: 4,
              order: 1,
              components: [
                {
                  id: 'comp-5',
                  type: 'heading',
                  order: 0,
                  props: {
                    text: 'Feature 2',
                    level: 'h3',
                    alignment: 'center'
                  }
                },
                {
                  id: 'comp-6',
                  type: 'text',
                  order: 1,
                  props: {
                    text: 'Description of feature 2',
                    alignment: 'center'
                  }
                }
              ]
            },
            {
              id: 'col-5',
              width: 4,
              order: 2,
              components: [
                {
                  id: 'comp-7',
                  type: 'heading',
                  order: 0,
                  props: {
                    text: 'Feature 3',
                    level: 'h3',
                    alignment: 'center'
                  }
                },
                {
                  id: 'comp-8',
                  type: 'text',
                  order: 1,
                  props: {
                    text: 'Description of feature 3',
                    alignment: 'center'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Empty page content for new pages
 */
export const emptyPageContent: PageContent = {
  sections: []
}
