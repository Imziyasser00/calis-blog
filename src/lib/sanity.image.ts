import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { projectId, dataset } from './sanity.client'
const builder = imageUrlBuilder({ projectId, dataset })
export const urlFor = (src: Image) => builder.image(src)
