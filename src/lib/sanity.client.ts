import { createClient } from 'next-sanity'

export const apiVersion = process.env.SANITY_API_VERSION || '2025-08-01'
export const dataset = process.env.SANITY_DATASET || 'production'
export const projectId = process.env.SANITY_PROJECT_ID!

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
})

export const previewClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_READ_TOKEN,
    perspective: 'previewDrafts',
})
