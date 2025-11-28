/**
 * Widget Registry - Import all widgets
 * This file imports all widget definitions to register them with the component registry
 */

// First, export the registry
export { COMPONENT_CATEGORIES, componentRegistry } from '../component-registry'

// Then import widget files to execute their registration code
// These imports happen after the export, so componentRegistry is already available
import './content-widgets'
import './form-widgets'
import './interactive-widgets'
import './social-widgets'

/**
 * Widget Categories Overview:
 *
 * BASIC WIDGETS:
 * - Heading, Text, Button, Image, Spacer, Divider, Icon Box
 *
 * FORM WIDGETS:
 * - Contact Form, Newsletter Subscribe, Search
 *
 * MEDIA WIDGETS:
 * - Image, Video, Photo Gallery, Google Map
 *
 * DYNAMIC CONTENT WIDGETS:
 * - Blog Grid, Blog Carousel, Product Grid, Tour Packages
 * - Testimonials, FAQ, Stats Counter
 *
 * LAYOUT WIDGETS:
 * - Tabs, Accordion
 *
 * ADVANCED WIDGETS:
 * - Social Share, Social Feed, Pricing Table, Countdown Timer
 */
